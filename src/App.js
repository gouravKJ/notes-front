import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

  const API_BASE = 'https://notes-backend-m1o7.onrender.com/api';


function App() {
  const[notes,setnotes]=useState([]);
  const[title,settitle]=useState('');
  const[content,setcontent]=useState('');
  const[editingnote,seteditingnote]=useState(null);
  const[darkmode,setdarkmode]=useState(false);
  
  useEffect(()=>{
    fetchnotes();
  },[]);

  const fetchnotes=async()=>{
    const res=await fetch(`${API_BASE}/notes`);
    const data=await res.json();
    setnotes(data);
  }

  const addorupdatenote=async()=>{
    if(!title.trim() || !content.trim) return;


    if(editingnote){
      const res=await fetch(`${API_BASE}/notes/${editingnote}`,{
        method:'PUT',
                headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const updatenote=await res.json();
      setnotes(notes.map(note=>note._id===editingnote?updatenote:note));
      seteditingnote(null);
    }   else{
      const res=await fetch(`${API_BASE}/notes`,{
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({title,content}),
      });
      const newnote=await res.json();
      setnotes([newnote,...notes]);

    }

    settitle('');
    setcontent('');
  };

  const deletenote=async(id)=>{
    await fetch(`${API_BASE}/notes/${id}`,
      {method:'DELETE'}
    );
    setnotes(notes.filter(note=>note._id!==id));
  }

  const startedit=(note)=>{
    settitle(note.title);
    setcontent(note.content);
    seteditingnote(note._id);
  }




  return (
<div className={`App ${darkmode ? 'dark' : ''}`}>
      <div className="theme-toggle">
        <button onClick={() => setdarkmode(!darkmode)}>
          {darkmode ? '🌞' : '🌙'}
        </button>
      </div>

      <h1>🗒️ Notes keeper</h1>
       
       <div className='note-input'>
        <input type='text' value={title} placeholder='enter title...' onChange={(e)=>settitle(e.target.value)}/>
        <textarea placeholder='enter note...' value={content} onChange={(e)=>setcontent(e.target.value)}/>

          <button onClick={addorupdatenote}>{editingnote?'updatenote':'addnote'}</button>


       </div>

       <div classname='notes-list'>
        {notes.map(note=>(
          <div key={note._id} className='note'>
            <h2>{note.title}</h2>
              <p>{note.content}</p>
              <div className='actions'>
                <button onClick={()=>startedit(note)}>✏️ Edit</button>
                <button onClick={()=>deletenote(note._id)}>🗑️ Delete </button>
                </div>
              </div>
    
           
        ))}
       </div>
    </div>
  );
}

export default App;
