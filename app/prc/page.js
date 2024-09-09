'use client'

import { useEffect, useState } from 'react';

const FileUpload = () => {

  const [allFiles, setAllFiles] = useState([]);


 let correctClearArr = []
 let [correctArr,setCorrectArr] = useState([])

  useEffect(() => {
    if (allFiles.length > 0) {
      allFiles.forEach((a, i) => {
          correctClearArr.unshift({ brightness: 1, contrast: 1, saturation: 1, temperature: 0, blur: 0 })
      })
      setCorrectArr(correctClearArr)
  }
  }, [allFiles])

  const handleFileChange1 = (e) => {
    const newFiles1 = Array.from(e.target.files);
    newFiles1.forEach(file => {
      file.preview = URL.createObjectURL(file);
    });
    setAllFiles((prevFiles) => [...prevFiles, ...newFiles1]);
  };

  const handleFileChange2 = (e) => {
    const newFiles2 = Array.from(e.target.files);
    newFiles2.forEach(file => {
      file.preview = URL.createObjectURL(file);
    });
    setAllFiles((prevFiles) => [...prevFiles, ...newFiles2]);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange1}
        style={{ marginBottom: '10px' }}
      />
      <input
        type="file"
        multiple
        onChange={handleFileChange2}
      />
      <ul>
        {allFiles.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
      <ul>
        {correctArr.map((file, index) => (
          <li key={index}>{file.brightness}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
