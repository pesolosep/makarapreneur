// components/makarainspires/ShowArticle.tsx
import Image from "next/image";
import MakaraCard from "./MakaraCard";
import { Article } from "@/models/Article";

interface Props {
   article: Article
}

export default function ShowArticle({ article }: Props) {
   return (
       <div className="w-full min-h-[700px] flex justify-center py-12 px-12 gap-3">
           <div className="flex flex-col gap-5 max-w-[700px]">
               <h2 className="font-semibold text-xl text-center">
                   {article.title}
               </h2>
               <div className="w-full h-[1px] bg-signalBlack"></div>
               <div className="flex justify-center py-6">
                   <Image
                       src={article.imageUrl}
                       alt={article.title}
                       width={300}
                       height={400}
                       className="rounded-lg"
                   />
               </div>
               <div 
                   dangerouslySetInnerHTML={{ __html: article.content }}
                   className="prose max-w-none"
               />
               <div className="w-full h-[1px] bg-signalBlack my-6"></div>
               <div className="flex flex-wrap gap-5 justify-center">
                   <MakaraCard article={article} />
                   <MakaraCard article={article} />
               </div>
           </div>
       </div>
   );
}