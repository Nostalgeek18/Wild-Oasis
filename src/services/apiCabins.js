import supabase, {supabaseUrl} from "./supabase";

export async function getCabins() {
    const { data, error } = await supabase.from("cabins")
    .select("*")

    if(error) {
        console.error(error)
        throw new Error('Cabins could not be loaded')
    }

    return data;
}

export async function getCabin(id){
    const { data, error } = await supabase.from('cabins').select().eq("id", id).single();

    if(error) {
      console.log(error);
      throw new Error("Error while creating booking")
    }

    return data
}

export async function createEditCabin(newCabin, id) {

    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl); //trick to see if img has our supabase url.
    
    //Make sure imgName will be unique. Remove '/' so supabase dont get confuse and dont create new folders
    const imageName = `${Date.now()}-${newCabin.image.name}`.replaceAll("/", "")

    const imagePath = hasImagePath ? newCabin.image :
    `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`


    // 1. Create cabin/edit cabin
    let query = supabase.from('cabins')

    // A) Create
    if(!id){
        query = query
        .insert([
        {...newCabin, image: imagePath},
        ])
        .select()
        .single();
    }
    
    
    // B) Edit (note there is no array inside the method)
    if(id) {
        query = query.update({... newCabin, image: imagePath}).eq("id", id)
    }
    
    const { data, error } = await query.select().single()

    if(error) {
        console.error(error)
        throw new Error('Cabin could not be created')
    }

    // 2. Upload image
    if(hasImagePath) return data; //no need to upload again
    const { error: storageError } = await supabase
        .storage
        .from('cabin-images')
        .upload(imageName, newCabin.image)

    // 3. Delete the cabin IF there was an error uploading image
    if(storageError) {
        await supabase
            .from('cabins')
            .delete()
            .eq('id', data[0].id)
        throw new Error("Cabin image could not be uploading. Creation of the cabin aborted")
    }    

    return data;

}

export async function deleteCabin(id) {
    
    const { error } = await supabase
    .from('cabins')
    .delete()
    .eq('id', id)

    if(error) {
        console.error(error)
        throw new Error('Cabins could not be deleted')
    }

    return error;

}