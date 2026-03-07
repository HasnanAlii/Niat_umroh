export const formatShortCurrency = (amount) => {
  const number = Number(amount || 0)

  if (number >= 1000000000) {
    return `Rp ${(number / 1000000000).toFixed(1)} M`
  }

  if (number >= 1000000) {
    return `Rp ${(number / 1000000).toFixed(1)} jt`
  }

  if (number >= 1000) {
    return `Rp ${(number / 1000).toFixed(0)} rb`
  }

  return `Rp ${number}`
}