import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import db from "@/utils/db";

async function HeroCarousel() {
  const Hero = await db.hero.findMany(); //fetch all Hero Images from db

  console.log(Hero);
  return (
    <div className="lg:block hidden">
      <Carousel>
        <CarouselContent>
          {Hero.map((item: any) => (
            <CarouselItem key={item.id}>
              <div className="p-2 border-1 border-blue-500 rounded-md">
                <Image
                  src={item.image}
                  alt="Image 1"
                  width={400}
                  height={440}
                  loading="eager"
                  className="object-cover w-full h-[400px] rounded-md"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default HeroCarousel;
