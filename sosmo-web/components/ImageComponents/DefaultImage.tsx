import Image from 'next/image'


export const DefaultImage = (props:any) => {
  return (
    <Image
      src={"https://www.svgrepo.com/show/381974/completed-checkmark-done-complete.svg"}
      alt="Picture of the author"
      width="64px"
      height="64px"
      layout='fixed'
    />
  );
  }
