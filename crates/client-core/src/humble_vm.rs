use wasm_bindgen::prelude::*;

#[derive(Debug)]
enum Instruction {
    NextDataCell,
    Add(u8),
    Sub(u8),
    AssertEq(u8),
}

#[wasm_bindgen]
#[cfg_attr(test, derive(Debug))]
pub struct HumbleVM {
    instructions: Vec<Instruction>,
}

#[wasm_bindgen]
impl HumbleVM {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            instructions: vec![],
        }
    }

    #[wasm_bindgen(js_name = "loadCode")]
    pub fn load_code(&mut self, code: Vec<u8>) -> Result<(), String> {
        let mut instructions = vec![];

        let mut walker = code.iter();
        while let Some(&opcode) = walker.next() {
            if opcode == 1 {
                instructions.push(Instruction::NextDataCell);
            } else {
                let operand = *walker.next().ok_or_else(|| {
                    format!("malformed bytecode (expected an operand for instruction `{opcode}`)")
                })?;
                let instruction = match opcode {
                    2 => Instruction::Add(operand),
                    3 => Instruction::Sub(operand),
                    4 => Instruction::AssertEq(operand),
                    _ => {
                        return Err(format!(
                            "malformed bytecode (unknown instruction `{opcode}`)"
                        ))
                    }
                };
                instructions.push(instruction);
            }
        }

        self.instructions = instructions;

        Ok(())
    }

    pub fn run(&self, mut memory: Vec<u8>) -> Result<bool, String> {
        let mut data_ptr = 0;

        if memory.is_empty() && !self.instructions.is_empty() {
            return Err("no data in memory".to_owned());
        }

        for instruction in &self.instructions {
            match instruction {
                Instruction::NextDataCell => {
                    data_ptr += 1;
                    if data_ptr >= memory.len() {
                        return Err(format!(
                            "data pointer is out of bounds (current index: {data_ptr})"
                        ));
                    }
                }
                Instruction::Add(operand) => {
                    memory[data_ptr] = memory[data_ptr].overflowing_add(*operand).0;
                }
                Instruction::Sub(operand) => {
                    memory[data_ptr] = memory[data_ptr].overflowing_sub(*operand).0;
                }
                Instruction::AssertEq(operand) => {
                    if memory[data_ptr] != *operand {
                        return Ok(false);
                    }
                }
            }
        }
        Ok(true)
    }

    #[wasm_bindgen(js_name = "dumpCode")]
    pub fn dump_code(&self) -> String {
        format!("{:#?}", self.instructions)
    }
}

#[cfg(test)]
mod tests {
    use super::HumbleVM;

    #[test]
    fn test_load_code() {
        let mut vm = HumbleVM::new();
        vm.load_code(vec![1, 3, 8, 4, 0]).unwrap();
        println!("{vm:?}");
    }

    #[test]
    fn test_run() {
        let mut vm = HumbleVM::new();
        vm.load_code(vec![2, 1, 4, 1, 1, 3, 1, 4, 0, 1, 4, 2])
            .unwrap();
        assert!(vm.run(vec![0, 1, 2]).unwrap());
    }
}
