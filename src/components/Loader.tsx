import LoaderInner from '../template/LoaderInner.svg'
import LoaderOuter from '../template/LoaderOuter.svg'
export default () => (
<div className="LoaderContainer">
  <img src={LoaderInner} alt="loader" className='LoaderInner'/>
  <img src={LoaderOuter} alt="loader" className='LoaderOuter'/>
</div>)