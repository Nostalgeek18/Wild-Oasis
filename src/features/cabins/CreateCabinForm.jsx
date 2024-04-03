
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";

import { useForm } from "react-hook-form"
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal}) {
  
  const { isCreating, createCabinMutation } = useCreateCabin();
  const { isEditing, editCabinMutation } = useEditCabin();
  const isWorking = isCreating || isEditing; 

  const { id: editId, ...editValues} = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {}
  });
  
  const { errors } = formState;

   //this function is the paramter called on handleSubmit
   function onSubmit(data) {

     //If we're editing, its just gonna be a string
     const image = typeof data.image === 'string' ? data.image : data.image[0];

      if(isEditSession) editCabinMutation(
        { newCabinData : {...data, image}, id : editId }, {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          }
        }
      );
      else createCabinMutation(
        {...data, image}, 
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
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input type="text" id="name" {...register('name', {
          required: "This field is required"
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="Maximum capcity" error={errors?.maxCapacity?.message}>
        <Input type="number" id="maxCapacity" {...register('maxCapacity', {
          required: "This field is required",
          min: {
            value: 1,
            message: 'Capacity should be at least 1'
          }
        })} />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input type="number" id="regularPrice" {...register('regularPrice', {
          required: "This field is required",
          min: {
            value: 1,
            message: 'Capacity should be at least 1'
          }
        })} 
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input type="number" id="discount" defaultValue={0} {...register('discount', {
          required: "This field is required",
          min: {
            validate: (value) => value < getValues.regularPrice()
          }
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea type="number" id="description" defaultValue="" {...register('description', {
          required: "This field is required"
        })}
        disabled={isWorking}/>
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput 
        id="image" 
        accept="image/*"
        {...register('image', {required : isEditSession ? false : "This field is required"})}/>
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" onClick={()=>onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking}>{isEditSession ? 'Edit Cabin' : 'Create new Cabin'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
