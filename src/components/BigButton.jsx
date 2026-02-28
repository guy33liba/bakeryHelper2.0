function BigButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  ariaLabel,
  className = '',
}) {
  return (
    <button
      className={`big-button big-button-${variant} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export default BigButton
