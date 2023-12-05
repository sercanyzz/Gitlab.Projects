import {FC} from 'react'
import {Button, Modal} from 'react-bootstrap'

type Props = {
  title: string
  handleAccept: (event: React.MouseEvent<HTMLElement>) => void
  modalText: string
  acceptText?: string
  rejecttText?: string
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export const Prompt: FC<Props> = ({
  title,
  handleAccept,
  modalText,
  acceptText,
  rejecttText,
  show,
  setShow,
}) => {
  const handleClose = () => setShow(false)
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalText}</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          {rejecttText || 'Vazgeç'}
        </Button>
        <Button variant='primary' onClick={handleAccept}>
          {acceptText || 'Kabul et'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
