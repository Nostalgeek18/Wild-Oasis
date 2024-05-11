import styled from "styled-components";
import { useState } from "react";

const StyledTextarea = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: 5px;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 8rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`


const Textarea = ({maxLength, ...props}) => {

  const [text, setText] = useState('')

  function handleChange(e) {
    const newText = e.target.value; 
    if (newText.length > maxLength) return;
    setText(newText);

  }

  return (
    <Wrapper>
      <StyledTextarea
        onChange={(e)=>{handleChange(e)}}
        value={text}
      />
       {text.length || 0}/{maxLength}
    </Wrapper>
  )
}

export default Textarea;
