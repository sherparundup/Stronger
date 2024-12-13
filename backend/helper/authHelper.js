import bycrpt, { hash } from 'bcrypt';
export const HashPassword=async(password)=>{
    try {
        const salt=10;
        const HashedPassword=await bycrpt.hash(password,salt)
        return HashedPassword
        
    } catch (error) {
        console.log(error)
        
    }
    
}

export const ComparePassword=async(password,HashedPassword)=>{

    return bycrpt.compare(password,HashedPassword)



}