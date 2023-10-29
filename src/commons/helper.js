  export const formatPrice = (thousand) => {
    return (thousand/1).toLocaleString('zh',{
      style:'currency',
      currency: 'NTD',
      minimumFractionDigits:0
    })
  };