import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, remove, update } from 'firebase/database';
import './styles.css';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

initializeApp(firebaseConfig);
const database = getDatabase();

function App() {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({
        StudentID: '',
        FirstName: '',
        LastName: '',
        Gender: 'Male',
        DateOfBirth: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        RoomID: ''
    });

    useEffect(() => {
        const studentsRef = ref(database, 'students');
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            const studentsList = data ? Object.keys(data).map(key => ({ ...data[key], StudentID: key })) : [];
            setStudents(studentsList);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.StudentID) {
            update(ref(database, 'students/' + form.StudentID), form);
        } else {
            const newStudentRef = ref(database, 'students').push();
            set(newStudentRef, form);
        }
        setForm({
            StudentID: '',
            FirstName: '',
            LastName: '',
            Gender: 'Male',
            DateOfBirth: '',
            Email: '',
            PhoneNumber: '',
            Address: '',
            RoomID: ''
        });
    };

    const handleEdit = (student) => {
        setForm(student);
    };

    const handleDelete = (StudentID) => {
        remove(ref(database, 'students/' + StudentID));
    };

    return (
        <div className="container">
            <h1>Student Management</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="FirstName" placeholder="First Name" value={form.FirstName} onChange={handleChange} required />
                <input type="text" name="LastName" placeholder="Last Name" value={form.LastName} onChange={handleChange} required />
                <select name="Gender" value={form.Gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="date" name="DateOfBirth" value={form.DateOfBirth} onChange={handleChange} required />
                <input type="email" name="Email" placeholder="Email" value={form.Email} onChange={handleChange} required />
                <input type="text" name="PhoneNumber" placeholder="Phone Number" value={form.PhoneNumber} onChange={handleChange} />
                <textarea name="Address" placeholder="Address" value={form.Address} onChange={handleChange}></textarea>
                <input type="number" name="RoomID" placeholder="Room ID" value={form.RoomID} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Room ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.StudentID}>
                                <td>{student.FirstName}</td>
                                <td>{student.LastName}</td>
                                <td>{student.Gender}</td>
                                <td>{student.DateOfBirth}</td>
                                <td>{student.Email}</td>
                                <td>{student.PhoneNumber}</td>
                                <td>{student.Address}</td>
                                <td>{student.RoomID}</td>
                                <td>
                                    <button onClick={() => handleEdit(student)}>Edit</button>
                                    <button onClick={() => handleDelete(student.StudentID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;

