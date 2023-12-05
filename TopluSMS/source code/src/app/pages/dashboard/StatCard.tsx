/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {useNavigate} from 'react-router-dom'

type Props = {
  title: string
  showIcon: boolean
  icon: string
  activeStats: number | undefined
  deactiveStats: number | undefined
  loading?: boolean
  link: string
}

const StatCard: React.FC<Props> = ({
  title,
  showIcon,
  icon,
  activeStats,
  deactiveStats,
  loading = true,
  link,
}) => {
  const navigate = useNavigate()

  return (
    <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
      <div className='cursor-pointer card h-md-100 mb-5 mb-xl-10' onClick={() => navigate(link)}>
        {/* begin::Header */}
        <div className='card-header border-0'>
          <h3 className='card-title fw-bold text-dark'>{title}</h3>
          <div className='card-toolbar'>
            {/* begin::Menu */}
            {showIcon && <i className={`las la-${icon} fs-2x text-dark `}></i>}

            {/* end::Menu */}
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body pt-2'>
          {/* begin::Item */}
          <div className='d-flex flex-column mb-8 h-md-100'>
            {/* begin::Bullet */}
            {!loading ? (
              <>
                <span className='fs-2hx fw-bold text-dark me-2 lh-1 ls-n2'>
                  {activeStats} Aktif
                </span>
                <span className='text-gray-400 pt-1 fw-semibold fs-6'>{deactiveStats} Deaktif</span>
              </>
            ) : (
              <div className='d-flex flex-center h-md-100'>
                <span className='spinner-border'></span>
              </div>
            )}
          </div>
          {/* end:Item */}
        </div>
        {/* end::Body */}
      </div>
    </div>
  )
}

export {StatCard}
