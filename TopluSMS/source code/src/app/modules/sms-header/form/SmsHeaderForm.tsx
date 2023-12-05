import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, showErrorMessage, showSuccessMessage} from '../../../../_metronic/helpers'
import {initialSmsHeader, Option, SmsHeader} from '../../api/_models'
import clsx from 'clsx'
import {checkHeaderField, createSmsHeader, updateSmsHeader} from '../../api/_requests'
import {useNavigate} from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import {selectTheme} from '../../theme'
import {loadCompanies} from '../../api/_api'

type Props = {
  isSmsHeaderLoading: boolean
  smsHeader: SmsHeader
  mode: string
}

let checkHeaderTimeout: number = 0

export const SmsHeaderForm: FC<Props> = ({smsHeader, isSmsHeaderLoading, mode}) => {
  const preview = mode === 'view'
  const navigate = useNavigate()

  const [checkingHeaderTitle, setCheckingHeaderTitle] = useState(false)
  const [headerTitleError, setHeaderTitleError] = useState('')
  const [checkedHeaderTitle, setCheckedHeaderTitle] = useState('')
  const testHeader = (value: string | undefined): boolean => {
    if (checkedHeaderTitle === value) {
      return true
    }
    setHeaderTitleError('')
    setCheckingHeaderTitle(true)
    clearTimeout(checkHeaderTimeout)
    checkHeaderTimeout = window.setTimeout(() => {
      if (value) {
        setCheckedHeaderTitle(value)
        checkHeaderField('sms_title', value, smsHeader.id)
          .then((data) => {
            if (!data) {
              setHeaderTitleError('Böyle bir başlık var')
              return false
            }
          })
          .catch((error) => {
            showErrorMessage(`Bir hatayla karşılaşıldı, lütfen daha sonra tekrar deneyiniz`)
          })
          .finally(() => setCheckingHeaderTitle(false))
      }
    }, 1000)
    return true
  }

  const smsHeaderSchema = Yup.object().shape({
    smsTitle: Yup.string()
      .min(1, 'En az 1 karakter')
      .max(11, 'En fazla 11 karakter')
      .matches(/^[0-9a-zA-Z !"#$%&'()*+-.\/:;<=>?@_]+$/, 'Geçerli sms başlığı giriniz')
      .test('hatalı', 'message', testHeader)
      .required('Zorunlu alan'),
    companyId: mode === 'edit' ? Yup.string() : Yup.string().required('Zorunlu alan'),
  })

  const [initialValues] = useState<SmsHeader>({
    ...smsHeader,
    smsTitle: smsHeader.smsTitle || initialSmsHeader.smsTitle,
    companyId: smsHeader.companyId || initialSmsHeader.companyId,
    status: smsHeader.status || initialSmsHeader.status,
  })

  const redirectToList = (withRefresh?: boolean) => {
    navigate('/sms-headers/list')
  }
  const selectCompanyIdChange = ({value, label}: any) => {
    formik.setFieldValue('companyId', value)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: smsHeaderSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateSmsHeader(values)
            .then((updateResponse) => {
              if (updateResponse !== undefined) {
                const {resultCode} = updateResponse
                if (resultCode === 0) {
                  let stateText = values.status ? '' : 'deaktif olarak '
                  showSuccessMessage(`Sms Başlığı ${stateText}güncellenmiştir`)
                  isSmsHeaderLoading = true
                  setTimeout(() => navigate('/sms-headers/list'), 1000)
                } else {
                  showErrorMessage(`Sms Başlığı güncellenirken bir hatayla karşılaşıldı`)
                }
              }
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          await createSmsHeader(values).then((createResponse) => {
            if (createResponse !== undefined) {
              const {resultCode} = createResponse
              if (resultCode === 0) {
                let stateText = values.status ? '' : 'deaktif olarak '
                showSuccessMessage(`Sms Başlığı ${stateText}eklenmiştir`)
                isSmsHeaderLoading = true
                setTimeout(() => navigate('/sms-headers/list'), 1000)
              } else {
                showErrorMessage(`Sms Başlığı eklenirken bir hatayla karşılaşıldı`)
              }
            }
          })
        }
      } catch (ex) {
        console.error('error happened')
        console.error(ex)
        showErrorMessage(`Sms Başlığı eklenirken bir hatayla karşılaşıldı`)
        return
      } finally {
        setSubmitting(true)
      }
      redirectToList()
    },
  })
  // formik.getFieldProps('smsTitle').onChange = (e: React.ChangeEvent<any>) => {
  //   console.log('smsTitle:' + e.target.value)
  //   console.log('smsTitle:' + formik.getFieldProps('smsTitle').value)
  // }
  console.log(formik.values)
  console.log(formik.errors)
  return (
    <div className='card'>
      <div className='card-body'>
        <form id='smsHeader_form' className='form' onSubmit={formik.handleSubmit} noValidate>
          <div className='fv-row m-7'>
            <FormLabel preview={preview || mode === 'edit'}>Sms Başlığı</FormLabel>
            <FormInput
              placeholder='Sms başlığı Türkçe karakter içermemelidir'
              type='text'
              inputname='smsTitle'
              classname={getClassName(formik.touched.smsTitle, formik.errors.smsTitle)}
              disabled={formik.isSubmitting || isSmsHeaderLoading || preview}
              touched={formik.touched.smsTitle}
              error={formik.errors.smsTitle}
              props={formik.getFieldProps('smsTitle')}
              loading={checkingHeaderTitle}
              uniqueError={headerTitleError}
            />
          </div>

          {mode !== 'edit' && (
            <div className='fv-row m-7'>
              <FormLabel preview={preview || mode === 'edit'}>Firma</FormLabel>
              <AsyncSelect
                placeholder='Seçiniz'
                defaultValue={
                  mode !== 'add' &&
                  ({
                    value: initialValues.companyId,
                    label: initialValues.companyName,
                  } as Option)
                }
                loadOptions={loadCompanies}
                onChange={selectCompanyIdChange}
                defaultOptions
                noOptionsMessage={() => 'Firma bulunamadı'}
                loadingMessage={() => 'Yükleniyor'}
                theme={selectTheme}
                isDisabled={formik.isSubmitting || isSmsHeaderLoading || preview}
              />
              <input type='hidden' {...formik.getFieldProps('companyId')}></input>
            </div>
          )}

          <div className='fv-row m-7'>
            <FormLabel preview={preview}>Durumu</FormLabel>
            <div className='form-check form-check-custom form-check-solid form-check form-switch me-10'>
              <input
                className='form-check-input w-45px h-30px'
                type='checkbox'
                disabled={preview}
                defaultChecked={formik.getFieldProps('status').value}
                {...formik.getFieldProps('status')}
              />
              <label
                className='form-check-label text-gray-700 fw-bold'
                htmlFor='kt_builder_sidebar_minimize_desktop_enabled'
                data-bs-toggle='tooltip'
                data-kt-initialized='1'
              >
                {formik.getFieldProps('status').value ? 'Aktif' : 'Deaktif'}
              </label>
            </div>
          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-15'>
            <button
              type='reset'
              onClick={() => redirectToList()}
              className='btn btn-light me-3'
              data-kt-smsheaders-modal-action='cancel'
              disabled={formik.isSubmitting || isSmsHeaderLoading}
            >
              {preview ? 'Geri' : 'Vazgeç'}
            </button>

            {!preview && (
              <button
                type='submit'
                className='btn btn-primary'
                data-kt-smsheaders-modal-action='submit'
                disabled={
                  isSmsHeaderLoading ||
                  formik.isSubmitting ||
                  !formik.isValid ||
                  !formik.touched ||
                  headerTitleError !== '' ||
                  checkingHeaderTitle
                }
              >
                <span className='indicator-label'>Kaydet</span>
                {(formik.isSubmitting || isSmsHeaderLoading) && (
                  <span className='indicator-progress'>
                    Lütfen bekleyin...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            )}
          </div>
          {/* end::Actions */}
        </form>
      </div>
    </div>
  )
}

type LabelProps = {
  children?: React.ReactNode
  preview: boolean
}
const FormLabel: FC<LabelProps> = ({preview, children}) => {
  return <label className={(preview ? '' : 'required') + ' fw-bold fs-6 mb-2'}>{children}</label>
}

type InputProps = {
  placeholder?: string
  type?: string
  inputname?: string
  disabled?: boolean
  classname?: string
  error?: string
  touched?: boolean
  props?: object
  loading?: boolean
  uniqueError?: string
}

const FormInput: FC<InputProps> = ({
  placeholder,
  type,
  inputname,
  classname,
  disabled,
  touched,
  error,
  props,
  loading,
  uniqueError,
}) => {
  return (
    <>
      <input
        placeholder={placeholder}
        {...props}
        type={type}
        name={inputname}
        className={classname}
        autoComplete='off'
        disabled={disabled}
      />
      {loading && (
        <span className='indicator-progress' style={{display: 'block'}}>
          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
        </span>
      )}

      {uniqueError && (
        <div className='fv-plugins-message-container'>
          <div className='fv-help-block'>
            <span role='alert'>{uniqueError}</span>
          </div>
        </div>
      )}
      {touched && error && (
        <div className='fv-plugins-message-container'>
          <div className='fv-help-block'>
            <span role='alert'>{error}</span>
          </div>
        </div>
      )}
    </>
  )
}

function getClassName(touched: boolean | undefined, error: string | undefined) {
  return clsx(
    'form-control mb-3 mb-lg-0',
    {'is-invalid': touched && error},
    {
      'is-valid': touched && !error,
    }
  )
}
