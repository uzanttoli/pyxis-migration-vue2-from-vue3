export const generateTimeStamp = () => {
  const date = new Date()
  return date.getTime().toString()
}
