

    let circulateDate = function (e){
        const today = new Date()
        const pastDate = new Date(e.Date)
        const diffInSeconds = Math.floor((today - pastDate) / 1000);
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);


          if (diffInSeconds < 1 * 60) {
              return '방금'
          } else if (diffInSeconds < 1 * 60 * 60) {
              return `${minutes}분전`
          } else if (diffInSeconds < 1 * 60 * 60 * 24) {
              return `${hours}시간전`
          } else if (diffInSeconds < 1 * 60 * 60 * 24 * 7) {
              return `${days}일전`
          } else if (diffInSeconds < 1 * 60 * 60 * 24 * 30) {
              return `${weeks}주전`
          } else if (diffInSeconds < 1 * 60 * 60 * 24 * 7 * 30 * 12) {
              return `${months}달전`
          } else if (diffInSeconds > 1 * 60 * 60 * 24 * 7 * 30 * 12) {
              return `${years}년전`
          }
        }
    
        export default circulateDate

   
