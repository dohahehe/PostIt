function PageWrapper({ children, isLoading }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {children}
    </div>
  );
}

export default PageWrapper;