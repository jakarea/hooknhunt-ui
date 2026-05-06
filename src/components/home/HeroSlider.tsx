'use client';
 
import Link from 'next/link'; 
import { useTranslation } from 'react-i18next'; 
 

export default function HeroSlider() {
  const { t } = useTranslation(); 

  return (
    <section className="w-full relative">
      <div className="container mx-auto overflow-hidden">
          <div className="h-[300px] md:h-[360px] lg:h-[400px] w-full bg-[#ccc]">
            <img src='https://cdn.pixabay.com/photo/2016/12/05/21/55/super-woman-1885016_1280.jpg' alt='Hero' className='w-full h-full object-cover' />
          </div>
      </div>
    </section>
  );
}
