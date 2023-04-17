import React from 'react'
import { useSigner } from 'wagmi'
import { ethers } from 'ethers'
import {
  Formik,
  FormikHelpers,
  FieldArray,
  FieldArrayRenderProps,
} from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Tooltip,
  IconButton,
  Button,
  FormErrorMessage,
  useToast,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'

// abi
import contract from '../../contracts/ElectoralCommission.json'

interface Candidate {
  name: string
}

interface ElectionFormValues {
  electionName: string
  postName: string
  startDate: number
  endDate: number
  candidates: Candidate[]
}

interface Props {
  onSubmitting: (submitting: boolean) => void
  onClose: () => void
}

const timestampToInputValue = (ts: number) => {
  const date = new Date(ts)
  return date.toISOString().substring(0, 10);
}

const electionFormSchema = Yup.object().shape({
  electionName: Yup.string().required('Election name is required.'),
  postName: Yup.string().required('Post name is required.'),
  startDate: Yup.number().required('Election start date is required.').moreThan(
    Date.now(),
    'Election start date must be in the future.'
  ),
  endDate: Yup.number()
    .required('Election end date is required.')
    .moreThan(
      Yup.ref('startDate'),
      'Election end date must be after start date.'
    ),
  candidates: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Candidate name is required.'),
    })
  ),
})

const TWO_DAYS_IN_MILLISENCODS = 24 * 60 * 60 * 1000  * 2
const EMPTY_CANDIDATE: Candidate = { name: '' }

export default function CreateElectionForm({ onSubmitting, onClose }: Props) {
  // state
  const initialValues: ElectionFormValues = {
    electionName: '',
    postName: '',
    candidates: [EMPTY_CANDIDATE, EMPTY_CANDIDATE],
    startDate: Date.now(),
    endDate: Date.now() + TWO_DAYS_IN_MILLISENCODS,
  }
  const [error, setError] = React.useState<string>('')

  let boundArrayHelpers: FieldArrayRenderProps

  // hooks
  const toast = useToast()
  const { data: signer } = useSigner()

  // methods
  const onSubmit = React.useCallback(
    async (
      values: ElectionFormValues,
      formikHelpers: FormikHelpers<ElectionFormValues>
    ) => {
      try {
        if (!signer) return
        const electoralCommission = new ethers.Contract(
          process.env.NEXT_PUBLIC_ELECTORAL_COMMISSION_CONTRACT_ADDRESS || '',
          contract.abi,
          signer
        )
        const candidates = values.candidates.map((candidate) => ({
          id: 0,
          voteCount: 0,
          ...candidate,
        }))
        formikHelpers.setSubmitting(true)
        onSubmitting(true)
        const tx = await electoralCommission.createElection(
          values.electionName,
          values.postName,
          values.startDate,
          values.endDate,
          candidates
        )
        await tx.wait()
        formikHelpers.setSubmitting(false)
        onSubmitting(false)
        formikHelpers.resetForm()
        onClose()
        toast({
          title: 'Election created.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      } catch (error: any) {
        if (error.code === ethers.errors.ACTION_REJECTED) {
          setError('User rejected transaction.')
          formikHelpers.setSubmitting(false)
          onSubmitting(false)
        }
      }
    },
    [onClose, onSubmitting, signer, toast]
  )

  return (
    <Box py='16px'>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={electionFormSchema}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          isValid,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Heading
              size='md'
              w='100%'
              textAlign={'center'}
              fontWeight='normal'
              mb='2%'
            >
              Election Details
            </Heading>
            <FormControl
              mt='2%'
              isInvalid={
                touched.electionName && errors.electionName !== undefined
              }
            >
              <FormLabel
                htmlFor='name'
                fontWeight={'normal'}
              >
                Election name
              </FormLabel>
              <Input
                id='name'
                name='electionName'
                value={values.electionName}
                isInvalid={
                  touched.electionName && errors.electionName !== undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
                type='text'
                placeholder='e.g Chairperson Election 2023'
                autoComplete='off'
              />
              {touched.electionName && errors.electionName && (
                <FormErrorMessage>{errors.electionName}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              mt='2%'
              isInvalid={touched.postName && errors.postName !== undefined}
            >
              <FormLabel
                htmlFor='postName'
                fontWeight={'normal'}
              >
                Post name
              </FormLabel>
              <Input
                id='postName'
                name='postName'
                value={values.postName}
                onChange={handleChange}
                onBlur={handleBlur}
                pr='4.5rem'
                type='text'
                placeholder='E.g Chairperson'
                autoComplete='off'
              />
              {touched.postName && errors.postName && (
                <FormErrorMessage>{errors.postName}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              mt='2%'
              isInvalid={touched.startDate && errors.startDate !== undefined}
            >
              <FormLabel
                htmlFor='startDate'
                fontWeight={'normal'}
              >
                Start date
              </FormLabel>
              <Input
                type='date'
                id='startDate'
                autoComplete='off'
                value={timestampToInputValue(values.startDate)}
                onChange={(e) => {
                  setFieldValue('startDate', new Date(e.target.value).getTime())
                }}
                onBlur={handleBlur}
                onClick={() => setFieldTouched('startDate', true)}
              />
               {touched.startDate && errors.startDate && (
                <FormErrorMessage>{errors.startDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              mt='2%'
              isInvalid={touched.endDate && errors.endDate !== undefined}
            >
              <FormLabel
                htmlFor='endDate'
                fontWeight={'normal'}
              >
                End date
              </FormLabel>
              <Input
                type='date'
                id='endDate'
                autoComplete='off'
                value={timestampToInputValue(values.endDate)}
                onChange={(e) => {
                  setFieldValue('endDate', new Date(e.target.value).getTime())
                }}
                onBlur={handleBlur}
                onClick={() => setFieldTouched('endDate', true)}
              />
               {touched.endDate && errors.endDate && (
                <FormErrorMessage>{errors.endDate}</FormErrorMessage>
              )}
            </FormControl>
            <HStack mt='24px'>
              <Heading
                size='md'
                w='100%'
                textAlign={'center'}
                fontWeight='normal'
              >
                Candidates (Min. 2)
              </Heading>
              <Tooltip label='Add candidate'>
                <IconButton
                  icon={<AddIcon />}
                  aria-label='Add candidate'
                  colorScheme='green'
                  onClick={() => boundArrayHelpers.push(EMPTY_CANDIDATE)}
                />
              </Tooltip>
            </HStack>
            <FieldArray
              name='candidates'
              render={(arrayHelpers) => {
                boundArrayHelpers = arrayHelpers
                return (
                  <Box>
                    {values.candidates.map((_, index) => (
                      <HStack key={index}>
                        <FormControl>
                          <FormLabel
                            htmlFor={`candidates.${index}.name`}
                            fontWeight={'normal'}
                            mt='2%'
                          >
                            Candidate {index + 1} name
                          </FormLabel>
                          <Input
                            id={`candidates.${index}.name`}
                            name={`candidates.${index}.name`}
                            value={values.candidates[index].name}
                            onChange={handleChange}
                            pr='4.5rem'
                            type='text'
                            placeholder='John Doe'
                            autoComplete='off'
                          />
                        </FormControl>
                        <Tooltip label='Remove candidate'>
                          <IconButton
                            icon={<MinusIcon />}
                            aria-label='Remove candidate'
                            colorScheme='red'
                            alignSelf='flex-end'
                            onClick={() => arrayHelpers.remove(index)}
                            isDisabled={values.candidates.length === 2}
                          />
                        </Tooltip>
                      </HStack>
                    ))}
                  </Box>
                )
              }}
            />

            <Button
              colorScheme='green'
              mt='20px'
              type='submit'
              isDisabled={!isValid}
              leftIcon={isSubmitting ? <Spinner /> : <></>}
            >
              {isSubmitting ? 'Creating election...' : 'Save'}
            </Button>
            {error && (
              <Text
                mt='12px'
                color='red'
              >
                {error}
              </Text>
            )}
          </form>
        )}
      </Formik>
    </Box>
  )
}
