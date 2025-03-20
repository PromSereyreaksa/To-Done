const Login = () => (
    <div className="min-h-screen bg-[#020F2B] text-white flex items-center justify-center">
      <div className="bg-[#051640] p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to ToDone</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2]"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2]"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <a href="#" className="text-sm text-[#A7E8D2] hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-[#A7E8D2] text-[#020F2B] py-2 rounded-md font-medium hover:bg-[#A7E8D2]/80 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-[#A7E8D2] hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
  
  export default Login;
  