import React, { useEffect } from 'react'
import { Accordion } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { FacebookIcon, FacebookShareButton, FacebookShareCount, WhatsappIcon, WhatsappShareButton } from 'react-share';

const Help = () => {

  const { t } = useTranslation();

  const FAQ = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
  { q: "faq.q7", a: "faq.a7" },
  { q: "faq.q8", a: "faq.a8" },
  { q: "faq.q9", a: "faq.a9" },
  { q: "faq.q10", a: "faq.a10" }
];


  return (
    <> 
  
    <div className='pt-2'>
   
      {
        FAQ.map((item,index)=><> <Accordion defaultActiveKey="0" className=' mx-3'>
      <Accordion.Item eventKey={index} key={index} className='my-3'>
        <Accordion.Header><p className='fw-bold pt-3 pb-0'>{t(item.q)}</p></Accordion.Header>
        <Accordion.Body>
         {t(item.a)}
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion></>)
      }
    </div>
    </>
  )
}

export default Help
