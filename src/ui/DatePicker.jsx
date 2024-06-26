import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

const StyledDatePicker = styled(DatePicker)`
    border: 1px solid var(--color-grey-300);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    padding: 0.8rem 1.2rem;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
`;

export default StyledDatePicker