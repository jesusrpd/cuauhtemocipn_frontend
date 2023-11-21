"use client"

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function ModalGiveway({handleCloseDetails}){
    const {isOpen, onOpen, onClose} = useDisclosure();

    return(
        <Modal backdrop="blur" isOpen={true} onClose={()=> handleCloseDetails(onClose)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p> Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseDetails(onClose)}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
}