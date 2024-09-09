// let circulateDate = function (date     let [Y,M,D,h,m,s] = [new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDate(),new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()]
//         if(date == Y){
//             if(dateh == M){
//                 if(date == D) {
//                     if(dates == h){
//                         if(datetes == m){
//                             if(s - datends > 10){
//                                 return(`${s - datends}초`)
//                             }else {
//                                 return('방금')
//                             }
//                         }else{
//                             if((m*60 + s)  - (datetes*60 + datends)>= 60){
//                                 return(`${m - datetes}분`)
//                             }else{
//                                 if(s - datends >= 10){
//                                     return(`${s - datends}초`)
//                                 }else if(s - datends < 10 && s - datends >= 0){
//                                     return('방금')
//                                 }else{
//                                     if(s+60 - datends > 10) {
//                                         return(`${s+60 - datends}초`)
//                                      }else{
//                                         return(`방금`)
//                                      }
//                                 }
//                             }
//                         }
//                     }else{
//                         if((h*60 + m) - (dates*60 + datetes) >= 60){
//                             return(`${h - dates}시간`)
//                         }else{
//                             if(m - datetes > 0){
//                                 return(`${m - datetes}분`)
//                             }else{
//                                 return(`${60 + m - datetes}분`)
//                             }
//                         }
//                     }
//                 }else{
//                     if(((D * 24 + h) - (date * 24 + dates) >=24)){
//                         return (`${D-date}일`)
//                     }else{
//                         if( h - dates> 0 ){
//                         return (`${h - dates}시간`)
//                         }else {
//                         return (`${h+24 - dates}시간`)
//                         }
//                     }
                        
//                 }
//             }else{
//                 if((M*12 + D - dateh*12 + date) >= 28){
//                     return(`${M - dateh}달`)
//                 }else{
//                     if(D - date > 0){
//                         return `${D - date}일`
//                     }else {
//                         return `${D + 28 - date}일`
//                     }
//                 }
//             }
//         }else{
//             if((Y*12 - date*12) >= 12){
//                 return(`${Y - date}년`)
//             }else{
//                 if(M - dateh > 0){
//                     return(`${M - dateh}달`)
//                 }else{
//                     return(`${M+12 - dateh}달`)
//                 }
//             }
//         }
//     }

//     export default circulateDate

    let circulateDate = function (e){
        const [Y,M,D,h,m,s] = [new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDate(),new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()]
        const date = new Date(e.Date)

            if(date.getFullYear() == Y){
                if(date.getMonth() + 1 == M){
                    if(date.getDate() == D) {
                        if(date.getHours() == h){
                            if(date.getMinutes() == m){
                                if(s - date.getSeconds() > 10){
                                    return(`${s - date.getSeconds()}초`)
                                }else {
                                    return('방금')
                                }
                            }else{
                                if((m*60 + s)  - (date.getMinutes()*60 + date.getSeconds())>= 60){
                                    return(`${m - date.getMinutes()}분`)
                                }else{
                                    if(s - date.getSeconds() >= 10){
                                        return(`${s - date.getSeconds()}초`)
                                    }else if(s - date.getSeconds() < 10 && s - date.getSeconds() >= 0){
                                        return('방금')
                                    }else{
                                        if(s+60 - date.getSeconds() > 10) {
                                            return(`${s+60 - date.getSeconds()}초`)
                                         }else{
                                            return(`방금`)
                                         }
                                    }
                                }
                            }
                        }else{
                            if((h*60 + m) - (date.getHours()*60 + date.getMinutes()) >= 60){
                                return(`${h - date.getHours()}시간`)
                            }else{
                                if(m - date.getMinutes() > 0){
                                    return(`${m - date.getMinutes()}분`)
                                }else{
                                    return(`${60 + m - date.getMinutes()}분`)
                                }
                            }
                        }
                    }else{
                        if(((D * 24 + h) - (date.getDate() * 24 + date.getHours()) >=24)){
                            return (`${D-date.getDate()}일`)
                        }else{
                            if( h - date.getHours()> 0 ){
                            return (`${h - date.getHours()}시간`)
                            }else {
                            return (`${h+24 - date.getHours()}시간`)
                            }
                        }
                            
                    }
                }else{
                    if((M*12*28 + D - ((date.getMonth() + 1)*12*28 + date.getDate())) >= 28){
                        console.log('일')
                        return(`${M - date.getMonth() + 1}달`)
                    }else{
                        if(D - date.getDate() > 0){
                            return `${D - date.getDate()}일`
                        }else {
                            return `${D + 28 - date.getDate()}일`
                        }
                    }
                }
            }else{
                if((Y*12 - date.getFullYear()*12) >= 12){
                    return(`${Y - date.getFullYear()}년`)
                }else{
                    if(M - date.getMonth() + 1 > 0){
                        return(`${M - date.getMonth() + 1}달`)
                    }else{
                        return(`${M + 12 - date.getMonth() + 1}달`)
                    }
                }
            }
        }
    
        export default circulateDate

   