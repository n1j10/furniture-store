import * as zod from "zod";

export const productSchema = zod.object({

    name: zod.string().min(4,
        {
            message: "Name must be at least 4 characters long"
        }

    ).max(30,
        {
            message: "Name must be at most 10 characters long"
        }
    ),


    description: zod.string().refine((description) => {
        const wordCount = description.split(" ").length;
        return wordCount >= 10 && wordCount <= 500;
    },
        {
            message: "Description must be at between 10 and 500 words"
        }
    ),

    price: zod.coerce.number().int().min(0,
        {
            message: "Price must be a positive number ."
        }
    ),

    featured: zod.coerce.boolean().default(false),
})
//T = Generic        Generic means input dynamic user can type string or number or any others types
export function validateFuctionSchema<T>(schema: zod.ZodSchema<T>, data: unknown): T {
    // export function validateFuctionSchema(schema:any, data: unknown) { method 222
    const result = schema.safeParse(data)
    if (!result.success) {
        const error = result.error.issues.map((e: any) => e.message);
        throw new Error(error.join(', '));
    }
    return result.data;
}

// +++++++ old code  change it to fuction  validateFuctionSchema    +++++  I used this code direct in action.ts
// const validateData =  productSchema.safeParse(rowData);
// if(!validateData.success){
//   const error = validateData.error.issues.map((e)=>e.message);
//   throw new Error(error.join(', '));
// }   


function validateImageFile() {
    const imageSize = 1024 * 1024;
    const acceptedFileType = ['image/']

    return zod.instanceof(File).refine((file) => {
        return !file || file.size <= imageSize
    }, 'File size must be less than 1 MB')
    
        .refine((file) => { //refine means custom validation
            return !file || acceptedFileType.some((type) => file.type.startsWith(type));
        }, 'File  must be an image')
}

export const imageSchema = zod.object({
    image: validateImageFile()
})
