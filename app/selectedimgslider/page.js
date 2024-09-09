'use client'

export default function SelectedImgSlider({a,i}) {
    return (
        <img className={"selected-img-slider selected-img-slider" + i}
            src={a.preview} alt={`Preview ${i}`} style={{ width: '100px', margin: '0 10px' }}
            onClick={async (e) => {
                e.stopPropagation()
                let elements = Array.from(document.querySelectorAll('.selected-img'))
                await elements.forEach((a) => {
                    a.classList.remove('displayon')
                })
                document.querySelector(`.selected-img${i}`).classList.add('displayon')
            }} />
    )
}