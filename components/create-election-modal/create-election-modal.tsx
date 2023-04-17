import React from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import CreateElectionForm from './create-election-form'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const CreateElectionModal = ({ isOpen, onClose }: Props) => {
  const [submitting, setSubmitting] = React.useState<boolean>(false)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
      scrollBehavior='outside'
      size='lg'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton isDisabled={submitting}/>
        <ModalBody>
          <CreateElectionForm
            onSubmitting={setSubmitting}
            onClose={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
