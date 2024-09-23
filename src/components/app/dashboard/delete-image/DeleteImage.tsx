import { HTTPRequestClient } from '@/utilities/api-client'
import { API_DETAIL } from '@/configuration/api'
import { QUERY_KEYS } from '@/constants/query-key'
import { BaseResponse } from '@/models/response/base'
import { useGlobalState } from '@/utilities/store'
import { useMutation } from '@tanstack/react-query'
import { Button, Modal } from 'flowbite-react'
import HTTPMethod from 'http-method-enum'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BsTrash2 } from 'react-icons/bs'

export interface DeleteImageProps {
  id: string,
  image: string
}

export default function DeleteImage(props: DeleteImageProps) {

  const [modal, setModal] = useState(false);
  const router = useRouter();
  const [setAlert, queryClient] = useGlobalState(s => [s.alert.setAlert, s.query.queryClient]);

  const handleOnClickDeleteButton = () => setModal(true);
  const handleOnClickCancelButton = () => setModal(false);
  const handleOnDelete = () => {
    mutation.mutate();
  }

  const mutation = useMutation({
    mutationFn: async () => {
      return await HTTPRequestClient<BaseResponse<string>, { id: string }>({
        url: API_DETAIL.IMAGE.route,
        method: HTTPMethod.DELETE,
        data: {
          id: props.id
        }
      });
    },
    onSuccess: () => {
      setAlert('Thank you for the contribution. Your image has been hard-deleted', 'success');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_IMAGES] });
      setModal(false);
      router.push('/');
    },
    onError: (e) => {
      setAlert(e.message, 'failure');
    }
  });

  return (
    <>
      <BsTrash2 className='cursor-pointer' onClick={handleOnClickDeleteButton}/>
      <Modal show={modal} onClose={handleOnClickCancelButton} dismissible={true} popup>
        <Modal.Header/>
        <Modal.Body className='flex flex-col gap-4'>
          <div className='flex justify-center'>
            <Image src={props.image} width={0} height={0} sizes='100vw' alt='Your Image' className='text-center h-[200px] w-auto grayscale'/>
          </div>
          <h1 className='text-center text-lg font-bold'>Are you sure? <span className='text-red-600'>This cannot be undone</span></h1>
        </Modal.Body>
        {
          !mutation.isPending &&
          <Modal.Footer className='flex justify-center gap-3'>
            <Button color='success' onClick={handleOnClickCancelButton}>Let people steal!</Button>
            <Button color='failure' onClick={handleOnDelete}>For privacy!</Button>
          </Modal.Footer>
        }
      </Modal>
    </>
  )
}
