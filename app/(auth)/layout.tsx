
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
        <div className='h-full flex items-center justify-center'>
            {children}
        </div>
    </ClerkProvider>
  )
}


// const AuthLayout = ({children}: {children:React.ReactNode}) => {
//     return (
//         <div className="bg-red-500 h-full">
//             {children}
//         </div>
//       );
// }
 
// export default AuthLayout;