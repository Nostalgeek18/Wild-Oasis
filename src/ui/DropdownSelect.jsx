import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { MdKeyboardArrowDown } from "react-icons/md";

// Styled Icon that rotates based on isActive prop
const RotatingIcon = styled(MdKeyboardArrowDown)`
  transition: transform 0.2s ease-in-out;
  transform: ${props => props.isActive ? 'rotate(-180deg)' : 'rotate(0deg)'};
`;

const fadeInUp = css`
  @keyframes fadeInUp {
    from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
    to {
        transform: translate3d(0, 20px, 0);
        opacity: 0;
    }
  }
`;

const SelectMenu = styled.div`
    position: relative;
    width: 300px;
    max-width: 330px;
    z-index: 3000;
`

const Item = styled.i`
    font-size: 25px;
    margin-right: 12px;
    font-weight: 400;
    line-height: 1;
    text-rendering: auto;
`

const SelectBtn = styled.div`
    display: flex;
    height: 40px;
    background: #fff;
    padding: 20px;
    font-size: 18px;
    font-weight: 400;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    border: 1px solid var(--color-grey-300);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    padding: 0.8rem 1.2rem;
    box-shadow: var(--shadow-sm);

    ${Item} {
        font-size: 25px;
        transition: 0.3s;
    }

`

const OptionsWrapper = styled.ul`
  position: absolute;
  width: 300px;
  max-height: 144px;
  left:0;
  /* top: 80px; */
  overflow-y: auto;
  z-index: 1;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  animation-duration: 0.35s;
  animation-fill-mode: both;

  ${props => props.isActive ? css`
    display: block;
    opacity: 1;
    z-index: 10;
    ${props.dropdownDirection === 'up' ? 'bottom: 55px;' : 'top: 55px;'}
    animation-name: ${fadeInUp};
  ` : 'display: none;'}
`

const Option = styled.li`
  display: flex;
  position: relative;
  width: 100%;
  height: 40px;
  cursor: pointer;
  padding: 0 16px;
  border-radius: 8px;
  align-items: center;
  background: #fff;

  &:hover {
    background: #f2f2f2
  }
`

const OptionText = styled.span`
    font-size: 18px;
    color: #333;
`

export default function DropdownSelect({choices, onSelect, target }) {

    const [isActive, setIsActive] = useState(false);
    const [selection, setSelection] = useState('Select your option');
    const [dropdownDirection, setDropdownDirection] = useState('down');
    const selectBtnRef = useRef(null);

    function handleClick() {
        setIsActive(!isActive);
        updateDropdownDirection();
    }

    function handleOptionClick(id, text) {
        setSelection(text);
        setIsActive(false);
        onSelect(id); //Send back the select ID with callback function
    }

    function updateDropdownDirection() {
        if (selectBtnRef.current) {
            const rect = selectBtnRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceNeeded = 295; // The max-height of the dropdown

            if (spaceBelow < spaceNeeded && rect.top > spaceNeeded) {
                setDropdownDirection('up');
            } else {
                setDropdownDirection('down');
            }
        }
    }

    useEffect(() => {
        window.addEventListener('resize', updateDropdownDirection);
        return () => {
            window.removeEventListener('resize', updateDropdownDirection);
        };
    }, []);

    let sortedChoices = choices;
    try {
        sortedChoices = choices.sort((a,b) => a.id - b.id);
    } catch(e) {
        throw new Error('Every element of dropdown list needs an id ! Error : ',  e)
    }




    return (
        <SelectMenu>
            <SelectBtn ref={selectBtnRef} onClick={handleClick}>
                <OptionText>{selection}</OptionText>
                <RotatingIcon isActive={isActive} />
            </SelectBtn>

            <OptionsWrapper isActive={isActive} dropdownDirection={dropdownDirection}>

                {sortedChoices.map(choice => {
                    const { id } = choice
                    const displayName = choice[target]
                    return (
                        <Option key={id} onClick={() => handleOptionClick(id, displayName)}>
                            <Item />
                            <OptionText>{id} - {displayName}</OptionText>
                        </Option>
                    )
                })}
            </OptionsWrapper>
        </SelectMenu>
    );
}