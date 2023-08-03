export function Overlay() {
  const char = "absolute text-8xl font-extrabold p-0 m-0"
  return (
    <>
      <div className={`${char} top-10 left-1/4`}>
        I
      </div>
      <div className={`${char} top-10 left-1/2`}>
        R
      </div>
      <div className={`${char} top-10 left-3/4`}>
        O
      </div>
      <div className={`${char} bottom-10 left-1/2`}>
        T
      </div>
      <div className={`${char} bottom-10 left-3/4`}>
        A
      </div>
    </>
  )
}
