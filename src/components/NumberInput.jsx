import { styled } from "styled-components";
import { colors } from "../style/colors";

const Container = styled.div`
  width: 150px;
  border-radius: 5px;
  border: 2px solid grey;
  display: flex;
  justify-content: space-between;
  height: 35px;
`

const Sign = styled.div`
  background: ${props => props.$disabled ? 'grey' : colors.blue};
  color: white;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  padding-bottom: 4px;
`

const Value = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  font-size: 18px;
`

export const NumberInput = ({ value, max, onChange }) => {

  return (
    <Container>
      <Sign $disabled={value === 0} onClick={() => value > 0 && onChange(value - 1)}>
        -
      </Sign>
      <Value>
        {value}
      </Value>
      <Sign $disabled={max === 0} onClick={() => max > 0 && onChange(value + 1)}>
        +
      </Sign>
    </Container>
  );
}