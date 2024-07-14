import React from 'react'
import "./contacts.css"

function Contacts(props) {
    
    
  return (
    <main className='main-contacts'>
    <h1>Users's info</h1>
    <div>
      <p>Email : {props.user.email}</p>
      <p>Profile Name : {props.user.username}</p>
      <p>Name : {props.user.name}</p>
      <p>Last Name : {props.user.lastname}</p>
      <p>Birthday : {props.user.dob}</p>
      

    </div>
    </main>
  )

}

export default Contacts
