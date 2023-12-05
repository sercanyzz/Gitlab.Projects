import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, showErrorMessage, showSuccessMessage} from '../../../../_metronic/helpers'
import {initialUser, Option, User} from '../../api/_models'
import clsx from 'clsx'
import {checkUserField, createUser, updateUser} from '../../api/_requests'
import {useNavigate} from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import {loadCompanies} from '../../api/_api'
import {selectTheme} from '../../theme'

type Props = {
  isUserLoading: boolean
  user: User
  mode: string
}
let checkNameTimeout: number = 0

export const UserForm: FC<Props> = ({user, isUserLoading, mode}) => {
  const preview = mode === 'view'
  const navigate = useNavigate()
  const [checkingUser, setCheckingUser] = useState(false)
  const [checkedUserName, setCheckedUserName] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const [initialValues] = useState<User>({
    ...user,
    username: user.username || initialUser.username,
    nameSurname: user.nameSurname || initialUser.nameSurname,
    phone: user.phone || initialUser.phone,
    email: user.email || initialUser.email,
    role: user.role || initialUser.role,
    companyId: user.companyId || initialUser.companyId,
    status: user.status || initialUser.status,
    isTTEmployee: user.isTTEmployee || initialUser.isTTEmployee,
  })

  const testUsername = (value: string | undefined): boolean => {
    if (mode === 'edit' || checkedUserName === value) {
      return true
    }
    setUsernameError('')
    setCheckingUser(true)
    clearTimeout(checkNameTimeout)
    checkNameTimeout = window.setTimeout(() => {
      if (value) {
        setCheckedUserName(value)
        checkUserField('username', value, user.id)
          .then((data) => {
            if (!data) {
              setUsernameError('Böyle bir kullanıcı var')
              return false
            }
          })
          .catch((error) => {
            showErrorMessage(`Bir hatayla karşılaşıldı, lütfen daha sonra tekrar deneyiniz`)
          })
          .finally(() => setCheckingUser(false))
      }
    }, 1000)
    return true
  }

  const userSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'En az 3 karakter')
      .max(10, 'En fazla 10 karakter')
      .test('hatalı', 'message', testUsername)
      .required('Zorunlu alan'),
    nameSurname: Yup.string()
      .min(3, 'En az 3 karakter')
      .max(30, 'En fazla 30 karakter')
      .required('Zorunlu alan'),
    phone: Yup.string()
      .length(12, 'Geçerli bir telefon numarası giriniz')
      .matches(/^\+?905[0-8]{1}[0-9]{8}$/, 'Geçerli bir telefon numarası giriniz')
      .required('Zorunlu alan'),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-posta adresi geçerli değildir!')
      .min(3, 'En az 3 karakter')
      .max(55, 'En fazla 55 karakter')
      .required('Zorunlu alan'),
  })

  const redirectToList = (withRefresh?: boolean) => {
    navigate('/users/list')
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values).then((updateResponse) => {
            if (updateResponse !== undefined) {
              const {resultCode} = updateResponse
              if (resultCode === 0) {
                let stateText = values.status ? '' : 'deaktif olarak '
                showSuccessMessage(`Kullanıcı ${stateText}güncellenmiştir`)
                isUserLoading = true
                setTimeout(() => navigate('/users/list'), 1000)
              } else {
                showErrorMessage(`Kullanıcı güncellenirken bir hatayla karşılaşıldı`)
              }
            }
          })
        } else {
          await createUser(values).then((createResponse) => {
            if (createResponse !== undefined) {
              const {resultCode} = createResponse
              if (resultCode === 0) {
                let stateText = values.status ? '' : 'deaktif olarak '
                showSuccessMessage(`Kullanıcı ${stateText}eklenmiştir`)
                isUserLoading = true
                setTimeout(() => navigate('/users/list'), 1000)
              } else {
                showErrorMessage(`Kullanıcı eklenirken bir hatayla karşılaşıldı`)
              }
            }
          })
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        redirectToList()
      }
    },
  })
  const selectCompanyIdChange = ({value, label}: any) => {
    console.log({value, label})
    console.log('{value, label}')
    formik.setFieldValue('companyId', value)
  }

  const selectRoleChange = ({value, label}: any) => {
    formik.setFieldValue('role', value)
  }

  // formik.getFieldProps('email').onChange = (e: React.ChangeEvent<any>) => {
  //   console.log('email:' + e.target.value)
  // }
  return (
    <div className='card'>
      <div className='card-body'>
        <form id='user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
          <div className='m-7'>
            <div className='d-flex fv-row'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  {...formik.getFieldProps('isTTEmployee')}
                  type='checkbox'
                  disabled={preview || mode === 'edit'}
                  data-kt-check={formik.values.isTTEmployee}
                  data-kt-check-target='#kt_table_users .form-check-input'
                  checked={formik.values.isTTEmployee}
                />

                <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                  <div className='text-gray-800'>Türk Telekom çalışanı</div>
                </label>
              </div>
            </div>
          </div>

          <div className='fv-row m-7'></div>
          <div className='fv-row m-7'>
            <FormLabel preview={preview || mode === 'edit'}>Kullanıcı Adı</FormLabel>
            <FormInput
              placeholder='Kullanıcı Adı'
              type='text'
              inputname='username'
              classname={getClassName(formik.touched.username, formik.errors.username)}
              disabled={formik.isSubmitting || isUserLoading || preview || mode === 'edit'}
              touched={formik.touched.username}
              error={formik.errors.username}
              props={formik.getFieldProps('username')}
              loading={checkingUser}
              usernameError={usernameError}
            />
          </div>
          <div className='fv-row m-7'>
            <FormLabel preview={preview}>Ad, Soyad</FormLabel>
            <FormInput
              placeholder='Ad Soyad'
              type='text'
              inputname='nameSurname'
              classname={getClassName(formik.touched.nameSurname, formik.errors.nameSurname)}
              disabled={formik.isSubmitting || isUserLoading || preview}
              touched={formik.touched.nameSurname}
              error={formik.errors.nameSurname}
              props={formik.getFieldProps('nameSurname')}
            />
          </div>

          <div className='fv-row m-7'>
            <FormLabel preview={preview}>Mobil Telefon</FormLabel>
            <FormInput
              placeholder='905xxxxxxxxx'
              type='text'
              inputname='phone'
              classname={getClassName(formik.touched.phone, formik.errors.phone)}
              disabled={formik.isSubmitting || isUserLoading || preview}
              touched={formik.touched.phone}
              error={formik.errors.phone}
              props={formik.getFieldProps('phone')}
            />
          </div>

          <div className='fv-row m-7'>
            <FormLabel preview={preview}>E-posta</FormLabel>
            <FormInput
              placeholder='E-posta'
              type='email'
              inputname='email'
              classname={getClassName(formik.touched.email, formik.errors.email)}
              disabled={formik.isSubmitting || isUserLoading || preview}
              touched={formik.touched.email}
              error={formik.errors.email}
              props={formik.getFieldProps('email')}
            />
          </div>

          <div className='fv-row m-7'>
            <FormLabel preview={preview || mode === 'edit'}>Rol</FormLabel>
            <Select
              placeholder='Seçiniz'
              defaultValue={
                mode !== 'add' &&
                ({
                  value: initialValues.role,
                  label: initialValues.role,
                } as Option)
              }
              options={[
                {value: 'report_user', label: 'report_user'},
                {value: 'customer', label: 'customer'},
                {value: 'cc_user', label: 'cc_user'},
                {value: 'business_user', label: 'business_user'},
              ]}
              onChange={selectRoleChange}
              theme={selectTheme}
              isDisabled={formik.isSubmitting || isUserLoading || preview}
            />
            <input type='hidden' {...formik.getFieldProps('role')}></input>
          </div>

          {formik.getFieldProps('role').value !== 'cc_user' && !formik.values.isTTEmployee && (
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
                isDisabled={formik.isSubmitting || isUserLoading || preview || mode === 'edit'}
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
              data-kt-users-modal-action='cancel'
              disabled={
                formik.isSubmitting || isUserLoading || usernameError !== '' || checkingUser
              }
            >
              {preview ? 'Geri' : 'Vazgeç'}
            </button>

            {!preview && (
              <button
                type='submit'
                className='btn btn-primary'
                data-kt-users-modal-action='submit'
                disabled={
                  isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched
                }
              >
                <span className='indicator-label'>Kaydet</span>
                {(formik.isSubmitting || isUserLoading) && (
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
  usernameError?: string
}

const FormInput: FC<InputProps> = ({
  placeholder,
  loading,
  type,
  inputname,
  classname,
  disabled,
  touched,
  error,
  usernameError,
  props,
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
      {usernameError && (
        <div className='fv-plugins-message-container'>
          <div className='fv-help-block'>
            <span role='alert'>{usernameError}</span>
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
    'form-control mb-5 mb-lg-0',
    {'is-invalid': touched && error},
    {
      'is-valid': touched && !error,
    }
  )
}
