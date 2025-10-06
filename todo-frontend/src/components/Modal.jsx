import React, { useEffect, useState } from "react";
import {
  Button,
  Modal as ReactstrapModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default function CustomModal({ activeItem, isOpen, toggle, onSave }) {
  const [localItem, setLocalItem] = useState(activeItem);

  // keep local state in sync if parent changes activeItem
  useEffect(() => {
    setLocalItem(activeItem);
  }, [activeItem]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setLocalItem(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <ReactstrapModal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label htmlFor="todo-title">Title</Label>
            <Input
              type="text"
              id="todo-title"
              name="title"
              value={localItem.title}
              onChange={handleChange}
              placeholder="Enter Todo Title"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="todo-description">Description</Label>
            <Input
              type="text"
              id="todo-description"
              name="description"
              value={localItem.description}
              onChange={handleChange}
              placeholder="Enter Todo description"
            />
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="completed"
                checked={!!localItem.completed}
                onChange={handleChange}
              />
              {" "}Completed
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="success" onClick={() => onSave(localItem)}>
          Save
        </Button>
      </ModalFooter>
    </ReactstrapModal>
  );
}
