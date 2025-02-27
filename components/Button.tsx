type Buttonprops = {
  children: string;
  bgColor: string;
  textColor: string;
};

export default function Button({ children, bgColor, textColor }: Buttonprops) {
  return (
    <button
      className={`${bgColor} ${textColor} flex items-cent font-bold rounded-full px-4 py-2 my-3`}
    >
      <span>{children}</span>
    </button>
  );
}
