import  Spinner  from "../../ui/Spinner.jsx"
import { useGuests } from "./useGuests.js";
import Empty from "../../ui/Empty.jsx";
import DropdownSelect from "../../ui/DropdownSelect.jsx";

export default function GuestsDropdown({ onSelect }) {

    const { guests, isLoading } = useGuests();

    if(isLoading) return <Spinner/>

    if(!guests.length) return <Empty resourceName='guests'/>

    return (
        <DropdownSelect choices={guests} onSelect={onSelect} target="fullName"/>
    )
}