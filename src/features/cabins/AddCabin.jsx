import React from 'react'
import CreateCabinForm from "./CreateCabinForm";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

//old version
// export default function AddCabin() {
//     const [isOpenModal, setIsOpenModal] = useState(false);

//   return (
//     <div>
//         <Button onClick={()=>{setIsOpenModal(val => !val)}}>
//             Add New Cabin
//         </Button>
//         {isOpenModal && ( 
//             <Modal onClose={()=>setIsOpenModal(false)}>
//                 <CreateCabinForm onCloseModal={()=>setIsOpenModal(false)}/>
//             </Modal>
//         )}
//     </div>
//   )
// }

export default function AddCabin() {
    return (
        <div>
            <Modal>
                <Modal.Open opens='cabin-form'>
                    <Button>Add new cabin</Button>
                </Modal.Open>
                <Modal.Window name='cabin-form'>
                    <CreateCabinForm/>
                </Modal.Window>
            </Modal>
        </div>
    )
}
