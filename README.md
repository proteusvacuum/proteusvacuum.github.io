# My Homepage!

Install Ruby and Jekyll:
```bash
$ sudo apt-get install ruby-full build-essential zlib1g-dev

// Ensure the right variables are set (they might already be)
$ export GEM_HOME="$HOME/gems"
$ export PATH="$HOME/gems/bin:$PATH"

// Install jekyll and bundler
$ gem install jekyll bundler

$ bundle exec jekyll serve
// Navigate to http://localhost:4000
```

To update syntax highlighting style:

```bash
$ rougify style github > _sass/_syntax_highlighting.scss
```

You may need to change the background colour.