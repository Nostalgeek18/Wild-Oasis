import React from 'react'
import styled from "styled-components";
import {formatCurrency } from '../../utils/helpers'
import CreateCabinForm from './CreateCabinForm';
import { useDeleteCabin } from './useDeleteCabin';
import {HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2"
import { useCreateCabin } from './useCreateCabin';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Table from "../../ui/Table"
import Menus from '../../ui/Menus';
import useOutsideClick from '../../hooks/useOutsideClick';


const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;


export default function CabinRow({ cabin }) {

  const {isDeleting, deleteCabin } = useDeleteCabin();
  const { isCreating, createCabinMutation} = useCreateCabin();

  
  const { id: cabinId,
    name,
    maxCapacity,
    regularPrice, 
    image,
    discount ,
    description
  } = cabin;
  
  
  function handleDuplicate() {
    createCabinMutation({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description
    })
  }
  return (
      <Table.Row>
        <Img src={image}/>
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity}</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? <Discount>{formatCurrency(discount)}</Discount> : <span>&mdash;</span>}
        <div>
          <Modal>

          <Menus.Menu>

              <Menus.Toggle id={cabinId} />

              <Menus.List id={cabinId}>
                <Menus.Button 
                   icon={<HiSquare2Stack/>} 
                   onClick={handleDuplicate}
                   disabled={isCreating}
                   >
                   Duplicate
                </Menus.Button>
                
                {/* Wrap inside Modal.Open because they shall open the modal*/}
                <Modal.Open opens='edit'>
                  <Menus.Button icon={<HiPencil/>}>Edit</Menus.Button>
                </Modal.Open>

                <Modal.Open opens='delete'>
                  <Menus.Button icon={<HiTrash/>}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>

            <Modal.Window name='edit'>
              <CreateCabinForm cabinToEdit={cabin}/>
            </Modal.Window>

            <Modal.Window name='delete'>
              <ConfirmDelete 
                onConfirm={()=>{deleteCabin(cabinId)}}
                resourceName='cabins'
                disabled={isDeleting}
              />
            </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
  )
}

