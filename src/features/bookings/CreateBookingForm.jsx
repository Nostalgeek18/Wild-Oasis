

import { useState } from 'react';
import styled from 'styled-components';


import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import DatePicker from "../../ui/DatePicker";

import { useForm, Controller } from "react-hook-form"
import { useCreateBooking } from "./useCreateBooking";
import { useEditBooking } from "./useEditBooking";

function CreateBookingForm({ cabinToEdit = {}, onCloseModal}) {
  
  const [selectedStartDate, setselectedStartDate] = useState(null);
  const [selectedEndDate, setselectedEndDate] = useState(null)
  const { isCreating, createBookingMutation } = useCreateBooking();
  const { isEditing, editBookingMutation } = useEditBooking();
  const isWorking = isCreating || isEditing; 

  const { id: editId, ...editValues} = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { control, register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {}
  });
  
  const { errors } = formState;

   const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
   `
   //this function is the paramter called on handleSubmit
   function onSubmit(data) {


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
      <FormRow label="Cabin (to fix)" error={errors?.name?.message}>
        <Input type="number" id="cabinId" {...register('cabinId', {
          required: "This field is required"
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="Start date" noflex={true}>
         <Controller
            control={control}
            name='startDate'
            render={({field})=> (
                <DatePicker 
                id="startDate"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat='dd/MM/yyyy'
                />
            )}
         />
      </FormRow>

      <FormRow label="End date" noflex={true}>
        <Controller
                control={control}
                name='endDate'
                render={({field})=> (
                    <DatePicker 
                    id="startDate"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat='dd/MM/yyyy'
                    />
                )}
            />
      </FormRow>

      <FormRow label="Cabin price" error={errors?.cabinPrice?.message}>
        <Input type="number" id="cabinPrice" defaultValue={0} {...register('cabinPrice', {
          required: "This field is required",
          min: {
            validate: (value) => value >= 0
          }
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="Extras price" error={errors?.extrasPrice?.message}>
        <Input type="number" id="extrasPrice" defaultValue={0} {...register('extrasPrice', {
          required: "This field is required"
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="Total price" error={errors?.totalPrice?.message}>
        <Input type="number" id="totalPrice" defaultValue={0} {...register('totalPrice', {
          required: "This field is required",
          min: {
            validate: (value) => value > getValues.regularPrice()
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
        {...register('observations')}/>
      </FormRow>

      <FormRow label="Has paid">
            <Wrapper>
                <Label>
                <Input
                    type="radio"
                    value={true}
                    name="hasPaid"
                    {...register(`hasPaid`)} // Register checkbox input
                />
                Yes
                </Label>
                <Label>
                <Input
                    type="radio"
                    value={false}
                    name="hasPaid"
                    {...register(`hasPaid`)} // Register checkbox input
                />
                No
                </Label>
            </Wrapper>
        </FormRow>

      <FormRow label="Guest id (to fix)" error={errors?.guestId?.message}>
        <Input 
            id="guestId" 
            type="number"
            disabled={isWorking}
            {...register('guestId', {required : "This field is required"})}/>
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
