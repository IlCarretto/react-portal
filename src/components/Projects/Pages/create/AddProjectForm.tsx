import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { addToProject } from '../../../../redux/projects/projectSlice';
import { Project } from '../../../../redux/projects/type';
import { Box, Button, Form, Input, ListBtn, Select, Textarea } from "./AddProjectFormStyle";
import { useAppSelector } from '../../../../redux/store';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


const ProjectSchema = z.object({
  title: 
  z.string()
  .min(3, { message: "Il titolo deve contenere un minimo di 3 caratteri"})
  .max(20, { message: "Il titolo deve contenere un massimo di 20 caratteri"}),
  description: 
  z.string()
  .min(10, { message: "La descrizione deve contenere un minimo di 10 caratteri"})
  .max(500, { message: "La descrizione deve contenere un massimo di 500 caratteri"}),
  deadline: 
  z.string()
  .transform(str => new Date(str)),
  company: 
  z.string()
  .min(3, { message: "L'azienda deve contenere un minimo di 3 caratteri"})
  .max(20, { message: "L'azienda deve contenere un massimo di 20 caratteri"}),
  assigned_to:
  z.string()
});

const AddProjectForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useAppSelector((state) => state.users);
  const { zodResolver } = require('@hookform/resolvers/zod');
  const { register, handleSubmit, formState: { errors } } = useForm<Project>({ resolver: zodResolver(ProjectSchema)});
  const [success, setSuccess] = useState(false);

  const onSubmit = (data: Project) => {
    setSuccess(true);
    let deadlineDate = new Date(data.deadline);
    if (deadlineDate.toString() === "Invalid Date") {
      deadlineDate = new Date();
    }
    if (data.assigned_to.includes("Seleziona")) {
      data.assigned_to = [];
    }
    const newProject: Project = {
      ...data,
      deadline: deadlineDate,
    };
    dispatch(addToProject(newProject));
  };

  return (
    <Box>
      {success ? (
        <Form style={{justifyContent: 'center'}}>
        <h1 style={{textAlign: 'center'}}>Progetto aggiunto correttamente!</h1>
        <ListBtn onClick={() => navigate("/projects")}>Vai ai progetti</ListBtn>
      </Form>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Aggiungi un progetto</h2>
        <div className='mb-1'>
          <div>
            <label>
              Title:
            </label>
          </div>
          <Input type="text" {...register('title', { required: true})} />
          {errors.title && <small className='text-danger'>{errors.title.message}</small>}
        </div>
        <div className='mb-1'>
          <div>
            <label>
              Description:
            </label>
          </div>
          <Textarea
            cols={50}
            rows={10}
          {...register('description', { required: true})} />
          {errors.description && <small className='text-danger'>{errors.description.message}</small>}
        </div>
        <div className='mb-1'>
          <div>
            <label>
              Deadline:
            </label>
          </div>
          <Input type="date" {...register('deadline', { required: true})} />
          {errors.deadline && <small className='text-danger'>{errors.deadline.message}</small>}
        </div>
        <div className='mb-1'>
          <div>
          <label>
            Company:
          </label>
          </div>
          <Input type="text" {...register('company', { required: true})} />
          {errors.company && <small className='text-danger'>{errors.company.message}</small>}
        </div>
        <div className='mb-1'>
          <div>
            <label>
              Assegnato a:
            </label>
          </div>
          <Select {...register('assigned_to', { required: true})}>
          <option disabled selected>Seleziona</option>
            {users.map((user, index) => (
              <option key={index} value={user.username}>{user.username}</option>
            ))}
          </Select>
        </div>
        <Button className='mt-1' type="submit">Invia</Button>
      </Form>
      )}
    </Box>
  );
}

export default AddProjectForm