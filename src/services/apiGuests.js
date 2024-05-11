import supabase, {supabaseUrl} from "./supabase";

export async function getGuests() {
    const { data, error } = await supabase.from("guests")
    .select("*")

    if(error) {
        console.error(error)
        throw new Error('Users could not be loaded')
    }

    return data;
}

export async function getGuest(id){
    const { data, error } = await supabase.from('guests').select().eq("id", id).single();

    if(error) {
      console.log(error);
      throw new Error("Error while creating booking")
    }

    return data
}