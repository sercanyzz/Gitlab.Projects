import {FC, Fragment, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {
  isNotEmpty,
  isVKNValid,
  showErrorMessage,
  showSuccessMessage,
} from '../../../../_metronic/helpers'
import clsx from 'clsx'
import {useNavigate} from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import {selectTheme} from '../../theme'
import {loadPartners} from '../../api/_api'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {addDays, format, parse, subDays} from 'date-fns'

import tr from 'date-fns/locale/tr' // the locale you want
import {checkCompanyField, createCompany, updateCompany} from '../../api/_requests'
import {Company, Option} from '../../api/_models'

type Props = {
  isCompanyLoading: boolean
  company: Company
  mode: string
}

let checkFirmTimeout: number = 0
let checkVknTimeout: number = 0
let checkCdrTimeout: number = 0

export const CompanyForm: FC<Props> = ({company, isCompanyLoading, mode}) => {
  const [checkingFirm, setCheckingFirm] = useState(false)
  const [firmError, setFirmError] = useState('')
  const [checkedFirm, setCheckedFirm] = useState('')
  const testFirmName = (value: string | undefined): boolean => {
    if (checkedFirm === value || mode !== 'add') {
      return true
    }
    setFirmError('')
    setCheckingFirm(true)
    clearTimeout(checkFirmTimeout)
    checkFirmTimeout = window.setTimeout(() => {
      if (value) {
        setCheckedFirm(value)
        checkCompanyField('firm', value, company.id)
          .then((data) => {
            if (!data) {
              setFirmError('Belirtilen firma adı sistemde tanımlıdır. Tekrar kontrol ediniz.')
              return false
            }
          })
          .catch((error) => {
            showErrorMessage(`Bir hatayla karşılaşıldı, lütfen daha sonra tekrar deneyiniz`)
          })
          .finally(() => setCheckingFirm(false))
      }
    }, 1000)
    return true
  }

  const [checkingVkn, setCheckingVkn] = useState(false)
  const [vknError, setVknError] = useState('')
  const [checkedVkn, setCheckedVkn] = useState('')
  const testVkn = (vknNo: string | undefined): boolean => {
    if (!vknNo || vknNo.length !== 10 || Number.isNaN(vknNo) || !isVKNValid(vknNo)) return false

    if (checkedVkn === vknNo || vknNo === initialValues.vknNo) {
      return true
    }
    setVknError('')
    setCheckingVkn(true)
    clearTimeout(checkVknTimeout)
    checkVknTimeout = window.setTimeout(() => {
      if (vknNo) {
        setCheckedVkn(vknNo)
        checkCompanyField('vkn_no', vknNo, company.id)
          .then((data) => {
            if (!data) {
              setVknError(
                'Belirtilen vergi numarası sistemde tanımlıdır. Vergi numarasını tekrar kontrol ediniz.'
              )
              return false
            }
          })
          .catch((error) => {
            showErrorMessage(`Bir hatayla karşılaşıldı, lütfen daha sonra tekrar deneyiniz`)
          })
          .finally(() => setCheckingVkn(false))
      }
    }, 1000)
    return true
  }

  const [checkingCdr, setCheckingCdr] = useState(false)
  const [cdrError, setCdrError] = useState('')
  const [checkedCdr, setCheckedCdr] = useState('')
  const testCdr = (value: string | undefined): boolean => {
    if (checkedCdr === value) {
      return true
    }
    setCdrError('')
    setCheckingCdr(true)
    clearTimeout(checkCdrTimeout)
    checkCdrTimeout = window.setTimeout(() => {
      if (value) {
        setCheckedCdr(value)
        checkCompanyField('charged_number', value, company.id)
          .then((data) => {
            if (!data) {
              setCdrError(
                'Belirtilen ücretlendirme numarası sistemde tanımlıdır. Ücretlendirme numarasını tekrar kontrol ediniz.'
              )
              return false
            }
          })
          .catch((error) => {
            showErrorMessage(`Bir hatayla karşılaşıldı, lütfen daha sonra tekrar deneyiniz`)
          })
          .finally(() => setCheckingCdr(false))
      }
    }, 1000)
    return true
  }

  const companieschema = Yup.object().shape({
    firm: Yup.string()
      .min(1, 'En az 1 karakter')
      .max(40, 'En fazla 40 karakter')
      .test('hatalı', 'message', testFirmName)
      .required('Zorunlu alan'),
    firmAddress: Yup.string()
      .min(1, 'En az 1 karakter')
      .max(100, 'En fazla 100 karakter')
      .required('Zorunlu alan'),
    contactPerson: Yup.string()
      .min(1, 'En az 1 karakter')
      .max(30, 'En fazla 30 karakter')
      .required('Zorunlu alan'),
    contactPhone: Yup.string()
      .length(12, 'Telefon numarası 12 karakter uzunluğunda olmalı')
      .matches(/^\+?905[0-8]{1}[0-9]{8}$/, 'Geçerli bir telefon numarası giriniz')
      .required('Zorunlu alan'),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-posta adresi geçerli değildir!')
      .min(3, 'En az 3 karakter')
      .max(55, 'En fazla 55 karakter')
      .required('Zorunlu alan'),
    vknNo: Yup.string()
      .length(10, 'Vergi kimlik numarası 10 karakter olmalı')
      .matches(/^\+?[1-9]{1}[0-9]{9}$/, 'Geçerli bir vergi kimlik numarası giriniz')
      .test('hatalı', 'VKN Hatalı veya böyle bir VKN var', testVkn)
      .required('Zorunlu alan'),
    chargedNumber: Yup.string()
      .length(9, 'Ücretlenecek numara 9 karakter uzunluğunda olmalı!')
      .matches(/^\+?[0-8]{1}[0-9]{8}$/, 'Geçerli bir ücretlenecek numara giriniz')
      .test('hatalı', 'message', testCdr)
      .required('Zorunlu alan'),
    businessPartner: Yup.string(),
    useType: Yup.string(),
    smsLimit: Yup.number(),
    sendHourStart: Yup.string(),
    sendHourFinish: Yup.string(),
    status: Yup.boolean(),
    expireDate: Yup.string(),

    isBrandCode: Yup.boolean(),
    isAbroadSms: Yup.boolean(),
    isAbroadSmsWithHeader: Yup.boolean(),
    isFlashSms: Yup.boolean(),
    isFtpSms: Yup.boolean(),
    isKktcSms: Yup.boolean(),
    isNllsSms: Yup.boolean(),
    isNormalSms: Yup.boolean(),
    isOnnetSms: Yup.boolean(),
    isReportSmsContent: Yup.boolean(),
    isUnicodeSms: Yup.boolean(),
    isWapPushSms: Yup.boolean(),
  })

  const previewMode = mode === 'view'
  const editMode = mode === 'edit'
  const navigate = useNavigate()
  const [initialValues] = useState<Company>({
    ...company,
    firm: company.firm || '',
    firmAddress: company.firmAddress || '',
    contactPerson: company.contactPerson || '',
    contactPhone: company.contactPhone || '',
    email: company.email || '',
    vknNo: company.vknNo || '',
    chargedNumber: company.chargedNumber || '',
    businessPartner: company.businessPartner || '',
    useType: company.useType || '',
    smsLimit: company.smsLimit || 0,
    sendHourStart: company.sendHourStart || '00:00',
    sendHourFinish: company.sendHourFinish || '00:00',
    status: company.status || false,
    expireDate: company.expireDate || format(new Date(), 'dd.MM.yyyy'),
    isBrandCode: company.isBrandCode || false,
    isAbroadSms: company.isAbroadSms || false,
    isAbroadSmsWithHeader: company.isAbroadSmsWithHeader || false,
    isFlashSms: company.isFlashSms || false,
    isFtpSms: company.isFtpSms || false,
    isKktcSms: company.isKktcSms || false,
    isNllsSms: company.isNllsSms || false,
    isNormalSms: company.isNormalSms || false,
    isOnnetSms: company.isOnnetSms || false,
    isReportSmsContent: company.isReportSmsContent || false,
    isUnicodeSms: company.isUnicodeSms || false,
    isWapPushSms: company.isWapPushSms || false,
  })

  const redirectToList = (withRefresh?: boolean) => {
    navigate('/companies/list')
  }
  const selectBusinessPartnerChange = ({value, label}: any) => {
    formik.setFieldValue('businessPartner', value)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: companieschema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      if (values.useType === 'normal') {
        delete values.expireDate
        delete values.smsLimit
      }
      try {
        if (isNotEmpty(values.id)) {
          await updateCompany(values).then((updateResponse) => {
            if (updateResponse !== undefined) {
              const {resultCode} = updateResponse
              if (resultCode === 0) {
                let statusText = values.status ? '' : 'deaktif olarak '
                showSuccessMessage(`Firma ${statusText}güncellenmiştir`)
                isCompanyLoading = true
                setTimeout(() => navigate('/companies/list'), 1000)
              } else {
                showErrorMessage(`Firma güncellenirken bir hatayla karşılaşıldı`)
              }
            } else {
              showErrorMessage(`Firma güncellenirken bir hatayla karşılaşıldı`)
            }
          }).catch
        } else {
          await createCompany(values).then((createResponse) => {
            if (createResponse !== undefined) {
              const {resultCode} = createResponse
              if (resultCode === 0) {
                let statusText = values.status ? 'aktif' : 'deaktif '
                showSuccessMessage(`Firma ${statusText} olarak eklenmiştir`)
                isCompanyLoading = true
                setTimeout(() => navigate('/companies/list'), 1000)
              } else {
                showErrorMessage(`Firma eklenirken bir hatayla karşılaşıldı`)
              }
            } else {
              showErrorMessage(`Firma eklenirken bir hatayla karşılaşıldı`)
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
  const selectSmsLimitChange = ({value, label}: any) => {
    formik.setFieldValue('smsLimit', value)
  }

  const startDate = new Date()
  const finishDate = new Date()
  startDate.setHours(
    Number(initialValues?.sendHourStart?.substring(0, 2)),
    Number(initialValues?.sendHourStart?.substring(3, 5))
  )
  finishDate.setHours(
    Number(initialValues?.sendHourFinish?.substring(0, 2)),
    Number(initialValues?.sendHourFinish?.substring(3, 5))
  )
  const [sendHourStart, setSendHourStart] = useState<Date>(startDate)
  const [sendHourFinish, setSendHourFinish] = useState<Date>(finishDate)

  console.log(formik.values)
  console.log(formik.errors)

  return (
    <div className='card'>
      <div className='card-body'>
        <form id='company_form' className='form' onSubmit={formik.handleSubmit} noValidate>
          <ul className='nav nav-tabs nav-line-tabs mb-5 fs-6'>
            <li className='nav-item'>
              <a className='nav-link active' data-bs-toggle='tab' href='#kt_tab_pane_1'>
                Firma Bilgileri
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_2'>
                Sms Yetenekleri
              </a>
            </li>
          </ul>
          <div className='tab-content' id='myTabContent'>
            <div className='tab-pane fade active show' id='kt_tab_pane_1' role='tabpanel'>
              <div className='fv-row m-7'>
                <FormLabel preview={previewMode || editMode}>Firma Adı</FormLabel>
                <FormInput
                  placeholder='Firmanın ticari ünvanını giriniz'
                  type='text'
                  inputname='firm'
                  classname={getClassName(formik.touched.firm, formik.errors.firm)}
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode || editMode}
                  touched={formik.touched.firm}
                  error={formik.errors.firm}
                  props={formik.getFieldProps('firm')}
                  loading={checkingFirm}
                  uniqueError={firmError}
                />
              </div>

              <div className='fv-row m-7'>
                <FormLabel preview={previewMode || editMode}>Firma Adresi</FormLabel>
                <textarea
                  rows={4}
                  className={getClassName(formik.touched.firmAddress, formik.errors.firmAddress)}
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                  placeholder='Firmanın açık adresini giriniz. Bu bilgi BTK ile paylaşıldığından eksiksiz girilmesi gerekmektedir.'
                  {...formik.getFieldProps('firmAddress')}
                ></textarea>
                {formik.getFieldProps('firmAddress').value && (
                  <div className='fv-plugins-message-container'>
                    <div
                      className={'fv-block ' + (formik.errors.firmAddress ? 'invalid' : 'valid')}
                    >
                      <span role='feed'>
                        {formik.getFieldProps('firmAddress').value.length}/100
                      </span>
                    </div>
                  </div>
                )}

                {formik.touched.firmAddress && formik.errors.firmAddress && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.firmAddress}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className='fv-row m-7'>
                <FormLabel preview={previewMode}>İletişim Kurulacak Kişi</FormLabel>
                <FormInput
                  placeholder='Şirket yetkilisi'
                  type='text'
                  inputname='contactPerson'
                  classname={getClassName(
                    formik.touched.contactPerson,
                    formik.errors.contactPerson
                  )}
                  disabled={formik.isSubmitting || previewMode}
                  touched={formik.touched.contactPerson}
                  error={formik.errors.contactPerson}
                  props={formik.getFieldProps('contactPerson')}
                />
              </div>

              <div className='fv-row m-7'>
                <FormLabel preview={previewMode}>İletişim Numarası</FormLabel>
                <FormInput
                  placeholder='905xxxxxxxxx'
                  type='text'
                  inputname='contactPhone'
                  classname={getClassName(formik.touched.contactPhone, formik.errors.contactPhone)}
                  disabled={formik.isSubmitting || previewMode}
                  touched={formik.touched.contactPhone}
                  error={formik.errors.contactPhone}
                  props={formik.getFieldProps('contactPhone')}
                />
              </div>

              <div className='fv-row m-7'>
                <FormLabel preview={previewMode}>E-posta</FormLabel>
                <FormInput
                  placeholder='____@____.___'
                  type='email'
                  inputname='email'
                  classname={getClassName(formik.touched.email, formik.errors.email)}
                  disabled={formik.isSubmitting || previewMode}
                  touched={formik.touched.email}
                  error={formik.errors.email}
                  props={formik.getFieldProps('email')}
                />
              </div>

              <div className='fv-row m-7'>
                <FormLabel preview={previewMode}>Ücretlenecek Numara</FormLabel>
                <FormInput
                  placeholder='xxxxxxxxx'
                  type='text'
                  inputname='chargedNumber'
                  classname={getClassName(
                    formik.touched.chargedNumber,
                    formik.errors.chargedNumber
                  )}
                  disabled={formik.isSubmitting || previewMode}
                  touched={formik.touched.chargedNumber}
                  error={formik.errors.chargedNumber}
                  props={formik.getFieldProps('chargedNumber')}
                  loading={checkingCdr}
                  uniqueError={cdrError}
                />
              </div>

              <div className='fv-row m-7'>
                <FormLabel preview={previewMode}>Vergi Kimlik Numarası</FormLabel>
                <FormInput
                  placeholder='xxxxxxxxxx'
                  type='text'
                  inputname='vknNo'
                  classname={getClassName(formik.touched.vknNo, formik.errors.vknNo)}
                  disabled={formik.isSubmitting || previewMode}
                  touched={formik.touched.vknNo}
                  error={formik.errors.vknNo}
                  props={formik.getFieldProps('vknNo')}
                  loading={checkingVkn}
                  uniqueError={vknError}
                />
              </div>
              <div className='fv-row m-7'>
                <FormLabel preview={previewMode || editMode}>İş Ortağı</FormLabel>
                <AsyncSelect
                  isDisabled={formik.isSubmitting || isCompanyLoading || previewMode}
                  placeholder='Seçiniz'
                  defaultValue={
                    mode !== 'add' &&
                    ({
                      value: formik.values.businessPartner,
                      label: formik.values.businessPartner,
                    } as Option)
                  }
                  loadOptions={loadPartners}
                  onChange={selectBusinessPartnerChange}
                  defaultOptions
                  noOptionsMessage={() => 'Ortak bulunamadı'}
                  loadingMessage={() => 'Yükleniyor'}
                  theme={selectTheme}
                  isSearchable={false}
                />
                <input type='hidden' {...formik.getFieldProps('businessPartner')}></input>
              </div>
              <div className='fv-row m-7'>
                <FormLabel preview={previewMode}>Kullanım Tipi</FormLabel>
                <div className='mb-3'>
                  <div className='form-check form-check-custom form-check-solid'>
                    <input
                      id='useTypeTrial'
                      name='useType'
                      className='form-check-input'
                      type='radio'
                      value='trial'
                      checked={formik.values.useType === 'trial'}
                      disabled={previewMode}
                      onChange={formik.getFieldProps('useType').onChange}
                    />
                    <label className='form-check-label' htmlFor='useTypeTrial'>
                      Deneme
                    </label>
                  </div>
                </div>
                <div className='mb-3'>
                  <div className='form-check form-check-custom form-check-solid'>
                    <input
                      id='useTypeNormal'
                      name='useType'
                      className='form-check-input'
                      type='radio'
                      value='normal'
                      checked={formik.values.useType === 'normal'}
                      disabled={previewMode}
                      onChange={formik.getFieldProps('useType').onChange}
                    />
                    <label className='form-check-label' htmlFor='useTypeNormal'>
                      Normal
                    </label>
                  </div>
                </div>
              </div>
              {formik.values.useType === 'trial' && (
                <>
                  <div className='fv-row m-7 d-flex flex-row-auto justify-content-around'>
                    <div className='fv-row me-5 w-50'>
                      <FormLabel preview={previewMode || editMode}>
                        Sms Limit {formik.values.smsLimit}
                      </FormLabel>
                      <Select
                        placeholder='Seçiniz'
                        defaultValue={
                          formik.values.smsLimit &&
                          ({
                            value: formik.values.smsLimit ? formik.values.smsLimit : undefined,
                            label: formik.values.smsLimit ? formik.values.smsLimit : undefined,
                          } as Option)
                        }
                        options={[
                          {value: '10', label: '10'},
                          {value: '30', label: '30'},
                          {value: '50', label: '50'},
                          {value: '100', label: '100'},
                        ]}
                        onChange={selectSmsLimitChange}
                        theme={selectTheme}
                      />
                      <input type='hidden' {...formik.getFieldProps('smsLimit')}></input>
                    </div>
                    <div className='fv-row w-50'>
                      <FormLabel preview={previewMode || editMode}>Son Kullanma Tarihi</FormLabel>
                      <div className='mb-3'>
                        <DatePicker
                          selected={parse(
                            formik.values.expireDate
                              ? formik.values.expireDate
                              : format(new Date(), 'dd.MM.yyyy'),
                            'dd.MM.yyyy',
                            new Date()
                          )}
                          onChange={(date) => {
                            if (date) {
                              formik.setFieldValue('expireDate', format(date, 'dd.MM.yyyy'))
                            } else {
                              formik.setFieldValue('expireDate', '')
                            }
                          }}
                          locale={tr}
                          dateFormat='dd.MM.yyyy'
                          includeDateIntervals={[
                            {start: subDays(new Date(), 1), end: addDays(new Date(), 30)},
                          ]}
                          placeholderText='Tarih seçiniz'
                          className={getClassName(
                            formik.touched.expireDate,
                            formik.errors.expireDate
                          )}
                        />

                        <input type='hidden' {...formik.getFieldProps('expireDate')}></input>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className='fv-row m-7'>
                <FormLabel preview={previewMode || editMode}>Gönderim Saat Aralığı</FormLabel>
                <div className='mb-3'>
                  <DatePicker
                    selected={sendHourStart}
                    onChange={(time) => {
                      if (time) {
                        setSendHourStart(time)
                        formik.setFieldValue('sendHourStart', format(time, 'HH:mm'))
                      } else {
                        formik.setFieldValue('sendHourStart', '')
                      }
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeFormat='HH:mm'
                    timeCaption='Saat Aralığı'
                    placeholderText='Saat seçiniz'
                    dateFormat='HH:mm'
                    className={getClassName(
                      formik.touched.sendHourStart,
                      formik.errors.sendHourStart
                    )}
                    disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                  />
                </div>
                <div className='mb-3'>
                  <DatePicker
                    selected={sendHourFinish}
                    onChange={(time) => {
                      if (time) {
                        setSendHourFinish(time)
                        formik.setFieldValue('sendHourFinish', format(time, 'HH:mm'))
                      } else {
                        formik.setFieldValue('sendHourFinish', '')
                      }
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeFormat='HH:mm'
                    timeCaption='Saat Aralığı'
                    placeholderText='Saat seçiniz'
                    dateFormat='HH:mm'
                    className={getClassName(
                      formik.touched.sendHourFinish,
                      formik.errors.sendHourFinish
                    )}
                    disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                  />
                  <input type='hidden' {...formik.getFieldProps('sendHourFinish')}></input>
                </div>
              </div>
              <div className='fv-row m-7'>
                <FormLabel preview={previewMode}>Durumu</FormLabel>
                <div className='form-check form-check-custom form-check-solid form-check form-switch me-10'>
                  <input
                    className='form-check-input w-45px h-30px'
                    type='checkbox'
                    disabled={previewMode}
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
            </div>
            <div className='tab-pane fade' id='kt_tab_pane_2' role='tabpanel'>
              <div className='fv-row m-7'>
                <SmsAbilityCheck
                  field='isNormalSms'
                  text='Normal SMS'
                  value={formik.values.isNormalSms}
                  changeValue={formik.setFieldValue}
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isUnicodeSms'
                  value={formik.values.isUnicodeSms}
                  changeValue={formik.setFieldValue}
                  text='Unicode SMS'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isNllsSms'
                  value={formik.values.isNllsSms}
                  changeValue={formik.setFieldValue}
                  text='Türkçe NLLS Sms'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isWapPushSms'
                  value={formik.values.isWapPushSms}
                  changeValue={formik.setFieldValue}
                  text='Wap Push Sms'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isFlashSms'
                  value={formik.values.isFlashSms}
                  changeValue={formik.setFieldValue}
                  text='Flash Sms'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isFtpSms'
                  value={formik.values.isFtpSms}
                  changeValue={formik.setFieldValue}
                  text='FTP ile Sms '
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isOnnetSms'
                  value={formik.values.isOnnetSms}
                  changeValue={formik.setFieldValue}
                  text='Onnet sms'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isKktcSms'
                  value={formik.values.isKktcSms}
                  changeValue={formik.setFieldValue}
                  text='KKTC gönderimi'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isAbroadSms'
                  value={formik.values.isAbroadSms}
                  changeValue={formik.setFieldValue}
                  text='Yurtdışı gönderim'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isAbroadSmsWithHeader'
                  value={formik.values.isAbroadSmsWithHeader}
                  changeValue={formik.setFieldValue}
                  text='Yurtdışına sms başlığı ile gönderim'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isBrandCode'
                  value={formik.values.isBrandCode}
                  changeValue={formik.setFieldValue}
                  text='BrandCode kontrolü '
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
                <SmsAbilityCheck
                  field='isReportSmsContent'
                  value={formik.values.isReportSmsContent}
                  changeValue={formik.setFieldValue}
                  text='Sms içeriklerini raporlama'
                  disabled={formik.isSubmitting || isCompanyLoading || previewMode}
                />
              </div>
            </div>
          </div>
          {/* begin::Actions */}
          <div className='text-center pt-15'>
            <button
              type='reset'
              onClick={() => redirectToList()}
              className='btn btn-light me-3'
              data-kt-companies-modal-action='cancel'
              disabled={
                formik.isSubmitting ||
                isCompanyLoading ||
                firmError !== '' ||
                checkingFirm ||
                vknError !== '' ||
                checkingVkn ||
                cdrError !== '' ||
                checkingCdr
              }
            >
              {previewMode ? 'Geri' : 'Vazgeç'}
            </button>

            {!previewMode && (
              <button
                type='submit'
                className='btn btn-primary'
                data-kt-companies-modal-action='submit'
                disabled={
                  isCompanyLoading || formik.isSubmitting || !formik.isValid || !formik.touched
                }
              >
                <span className='indicator-label'>Kaydet</span>
                {(formik.isSubmitting || isCompanyLoading) && (
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

type AbilityProps = {
  field: string
  text: string
  value?: boolean
  changeValue: (field: string, value: boolean) => void
  disabled: boolean
}
const SmsAbilityCheck: FC<AbilityProps> = ({field, text, value, changeValue, disabled}) => {
  return (
    <div className='mb-10 d-flex flex-stack'>
      <div className='d-flex me-10'>
        <label
          className='form-check-label'
          htmlFor={field + '_check'}
          role={disabled ? '' : 'button'}
        >
          {text}
        </label>
      </div>
      <div className='d-flex justify-content-end'>
        <div className='form-check form-switch form-check-solid'>
          <input
            className='form-check-input w-45px h-30px'
            type='checkbox'
            value={field}
            id={field + '_check'}
            checked={value}
            onChange={() => changeValue(field, !value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
