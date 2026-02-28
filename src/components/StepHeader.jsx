function StepHeader({ title, subtitle }) {
  return (
    <div className="step-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

export default StepHeader
