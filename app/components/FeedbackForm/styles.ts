const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: 'var(--background)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  positive: (active: boolean) => ({
    padding: '8px 15px',
    borderRadius: '5px',
    border: `1px solid ${active ? '#28a745' : '#ccc'}`,
    backgroundColor: active ? '#00CA04' : 'var(--background)',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal',
  }),
  negative: (active: boolean) => ({
    padding: '8px 15px',
    borderRadius: '5px',
    border: `1px solid ${active ? '#dc3545' : '#ccc'}`,
    backgroundColor: active ? '#D60000' : 'var(--background)',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal',
  }),
  stars: {
    marginBottom: '10px',
  },
  star: (filled: boolean) => ({
    cursor: 'pointer',
    color: filled ? 'gold' : 'gray',
    fontSize: '24px',
    marginRight: '2px',
  }),
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  submit: (disabled: boolean) => ({
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    opacity: disabled ? 0.6 : 1,
  }),
};

export default styles;