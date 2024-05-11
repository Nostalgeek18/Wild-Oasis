

import styled from 'styled-components';
import { useState } from 'react';
import { differenceInDays } from "date-fns";
import { toast } from "react-hot-toast"
import { useForm, Controller } from "react-hook-form"


import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import DatePicker from "../../ui/DatePicker";

import { useCreateBooking } from "./useCreateBooking";
import { useEditBooking } from "./useEditBooking";

import GuestsDropdown from '../guests/GuestsDropdown';
import CabinsDropdown from "../cabins/CabinsDropdown";

function CreateBookingForm({ cabinToEdit = {}, onCloseModal}) {

  
  const { isCreating, createBookingMutation } = useCreateBooking();
  const { isEditing, editBookingMutation }    = useEditBooking();

  const isWorking = isCreating || isEditing; 

  const { id: editId, ...editValues} = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { control, register, handleSubmit, reset, getValues,setValue, formState } = useForm({
    defaultValues: isEditSession ? editValues : {}
  });
  
  
  const { errors } = formState;

  const [selectedGuestId, setSelectedGuestId] = useState(null);
   // This function updates both local state and the value in react-hook-form
   const handleSelectGuest = (id) => {
    setSelectedGuestId(id);
    setValue('guestId', id, { shouldValidate: true });
  };

  const [selectedCabinId, setSelectedCabinId] = useState(null)
  const handleSelectCabin = (id) => {
    setSelectedCabinId(id);
    setValue('cabinId', id, { shouldValidate: true });
  };


   const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
   `

   //this function is the paramter called on handleSubmit
   function onSubmit(data) {

    const numNights = differenceInDays(
        data.endDate,
        data.startDate
    )


    //ADD fields regarding bookings

    //calc num nights
    if(numNights < 1) {
        toast.error('Error : End date has to be at least 1 day past the starting date.')
    }

    data["numNights"] = numNights;

    //calc total price 
    data.totalPrice = parseFloat(data.cabinPrice) + parseFloat(data.extrasPrice);


      if(isEditSession) editBookingMutation(
        { newBookingData : {...data}, id : editId }, {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          }
        }
      );
      else createBookingMutation(
        {...data}, 
        {
        onSuccess: (data) => {
          reset();
          onCloseModal?.()
        } //'data' comes from the data returned from the mutation. 
        }
      )
   }

   function onError(errors) {
      //console.log(errors)
   }


  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ?  'modal' : 'regular'}>
      <FormRow label="Cabin" error={errors?.name?.message}>
      <>
          <CabinsDropdown onSelect={handleSelectCabin} />
          <Input 
                id="cabinId" 
                type="number"
                disabled={isWorking}
                hidden
                value={selectedCabinId}
                {...register('cabinId', {required : "This field is required"})}/>
        </>
      </FormRow>

      <FormRow label="Start date" noflex={true}>
         <Controller
            control={control}
            name='startDate'
            rules={{
                required: 'Start date is required'
            }}
            render={({field})=> (
                <DatePicker 
                id="startDate"
                defaultValue={new Date()}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat='dd/MM/yyyy'
                autoComplete="off"
                minDate={new Date()}
                />
            )}
         />
      </FormRow>

      <FormRow label="End date" noflex={true}>
        <Controller
                control={control}
                name='endDate'
                rules={{
                    required: 'Start date is required'
                }}
                render={({field})=> (
                    <DatePicker 
                        id="startDate"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat='dd/MM/yyyy'
                        autoComplete="off"
                        minDate={new Date()}
                    />
                )}
            />
      </FormRow>


      <FormRow label="Extras price" error={errors?.extrasPrice?.message}>
        <Input type="number" id="extrasPrice" defaultValue={0} {...register('extrasPrice', {
          required: "This field is required",
          min: {
            validate: (value) => value >= 0,
            message: "Cabin price cannot be negative"
          }
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="number of guests" error={errors?.numGuests?.message}>
        <Input type="number" id="numGuests" defaultValue="" {...register('numGuests', {
          required: "This field is required"
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="observations" error={errors?.observations?.message}>
        <Textarea 
          id="observations" 
          type="text"
          disabled={isWorking}
          maxLength={100}
          {...register('observations')}/>
      </FormRow>

      <FormRow label="Has breakfast">
            <Wrapper>
                <Label>
                <Input
                    type="radio"
                    value={true}
                    name="hasBreakfast"
                    {...register(`hasBreakfast`)} // Register checkbox input
                />
                Yes
                </Label>
                <Label>
                <Input
                    type="radio"
                    value={false}
                    name="hasBreakfast"
                    {...register(`hasBreakfast`)} // Register checkbox input
                />
                No
                </Label>
            </Wrapper>
        </FormRow>

      <FormRow label="Is paid">
            <Wrapper>
                <Label>
                <Input
                    type="radio"
                    value={true}
                    name="isPaid"
                    {...register(`isPaid`)} // Register checkbox input
                />
                Yes
                </Label>
                <Label>
                <Input
                    type="radio"
                    value={false}
                    name="isPaid"
                    {...register(`isPaid`)} // Register checkbox input
                />
                No
                </Label>
            </Wrapper>
        </FormRow>

      <FormRow label="Guest" error={errors?.guestId?.message}>
        <>
          <GuestsDropdown onSelect={handleSelectGuest} />
          <Input 
                id="guestId" 
                type="number"
                disabled={isWorking}
                hidden
                value={selectedGuestId}
                {...register('guestId', {required : "This field is required"})}/>
        </>
      </FormRow>

      {/* <FormRow label="Cabin photo">
        <FileInput 
        id="image" 
        accept="image/*"
        {...register('image', {required : isEditSession ? false : "This field is required"})}/>
      </FormRow> */}

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" onClick={()=>onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking}>{isEditSession ? 'Edit Booking' : 'Create new Booking'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
