import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// const handleAuth = () => {
//     const  userId  = auth();
//     console.log(userId);
    
//     if (!userId) throw new Error("Unauthorized");
//     return { userId: userId };
// }

const handleAuth = async () => {  // <- make function async
    const authData = await auth();       // <- await the promise
    console.log(authData);

    if (!authData || !authData.userId) {
        throw new Error("Unauthorized");
    }

    return { userId: authData.userId };  // <- return the string userId
};



export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    messageFile: f(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;







