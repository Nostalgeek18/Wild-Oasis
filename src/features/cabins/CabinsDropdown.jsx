import  Spinner  from "../../ui/Spinner.jsx"
import { useCabins } from "./useCabins.js";
import Empty from "../../ui/Empty.jsx";
import DropdownSelect from "../../ui/DropdownSelect.jsx";

export default function GuestsDropdown({ onSelect }) {

    const { cabins, isLoading } = useCabins();

    if(isLoading) return <Spinner/>


    if(!cabins.length) return <Empty resourceName='cabins'/>

    return (
        <DropdownSelect choices={cabins} onSelect={onSelect} target="name"/>
    )
}